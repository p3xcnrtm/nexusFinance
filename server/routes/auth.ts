import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.ts';
import { sendEmail } from '../utils/email.ts';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nexus-super-secret-key-2026';

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, phone, country, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const stmt = db.prepare(`
      INSERT INTO users (fullName, email, phone, country, passwordHash, isVerified, otp)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `);
    
    const info = stmt.run(fullName, email, phone, country, passwordHash, otp);
    
    // Send OTP email asynchronously
    const emailHtml = `
      <h2>Welcome to Nexus Edge, ${fullName}!</h2>
      <p>Your account has been created. To verify your email address, please use the following One-Time Password (OTP):</p>
      <h1 style="font-size: 32px; letter-spacing: 5px; color: #F2A900;">${otp}</h1>
      <p>This OTP is valid for a short period. Do not share it with anyone.</p>
    `;
    sendEmail(email, 'Verify Your Nexus Edge Account', emailHtml).catch(console.error);
    
    res.status(201).json({ 
      message: 'OTP sent to email',
      email,
      requireOtp: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark as verified and clear OTP
    db.prepare('UPDATE users SET isVerified = 1, otp = NULL WHERE id = ?').run(user.id);

    // Generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const { passwordHash, otp: _, ...userWithoutPassword } = user;
    userWithoutPassword.isVerified = 1;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'Account is suspended. Contact support.' });
    }

    if (user.isVerified === 0) {
      // Generate new OTP and send
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      db.prepare('UPDATE users SET otp = ? WHERE id = ?').run(otp, user.id);
      
      const emailHtml = `
        <h2>Verify your account</h2>
        <p>Please use the following One-Time Password (OTP) to verify your account:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #F2A900;">${otp}</h1>
      `;
      sendEmail(email, 'Verify Your Nexus Edge Account', emailHtml).catch(console.error);

      return res.status(403).json({ error: 'Account not verified', requireOtp: true, email });
    }

    // Send login alert email
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const loginAlertHtml = `
      <h2>New Login Alert</h2>
      <p>Hello ${user.fullName},</p>
      <p>We detected a new login to your Nexus Edge account.</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
      <p>If this was not you, please contact support immediately and change your password.</p>
    `;
    sendEmail(user.email, 'New Login Alert - Nexus Edge', loginAlertHtml).catch(console.error);

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const { passwordHash, otp: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User (Me)
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare('SELECT id, fullName, email, phone, country, role, balance, status, kycStatus, createdAt FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;
