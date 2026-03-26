import express from 'express';
import db from '../db.ts';
import { authenticateToken } from './auth.ts';
import axios from 'axios';

const router = express.Router();

// NowPayments Configuration
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || 'YOUR_NOWPAYMENTS_API_KEY';
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Get user dashboard data
router.get('/dashboard', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT balance, status, kycStatus FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = db.prepare('SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 5').all(userId);
    
    // Calculate stats
    const totalDeposits = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE userId = ? AND type = 'deposit' AND status = 'Completed'").get(userId) as any;
    const totalWithdrawals = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE userId = ? AND type = 'withdrawal' AND status = 'Completed'").get(userId) as any;

    res.json({
      balance: user.balance,
      status: user.status,
      kycStatus: user.kycStatus,
      totalDeposits: totalDeposits.total || 0,
      totalWithdrawals: totalWithdrawals.total || 0,
      recentTransactions: transactions
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get user transactions
router.get('/transactions', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const transactions = db.prepare('SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get user portfolio
router.get('/portfolio', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const activeInvestments = db.prepare("SELECT * FROM investments WHERE userId = ? AND status = 'Active'").all(userId);
    const totalInvested = activeInvestments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
    
    // For asset allocation, we can just return a mock distribution based on total invested for now,
    // or if the user has specific assets, we can return those.
    const assetAllocation = [
      { name: 'Bitcoin', value: totalInvested * 0.45 },
      { name: 'Ethereum', value: totalInvested * 0.30 },
      { name: 'USDT', value: totalInvested * 0.15 },
      { name: 'Solana', value: totalInvested * 0.10 },
    ];

    res.json({
      totalValue: totalInvested,
      activePlans: activeInvestments,
      assetAllocation
    });
  } catch (error) {
    console.error('Portfolio Error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Create investment
router.post('/invest', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { planName, amount, roi, duration } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const invId = 'INV' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(duration));
    
    // Deduct balance
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, userId);

    // Create investment
    db.prepare(`
      INSERT INTO investments (id, userId, planName, amount, roi, duration, expiresAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(invId, userId, planName, amount, roi, duration, expiresAt.toISOString());

    // Create transaction record
    const txId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    db.prepare(`
      INSERT INTO transactions (id, userId, type, amount, asset, status)
      VALUES (?, ?, 'investment', ?, 'USD', 'Completed')
    `).run(txId, userId, amount);

    // Handle referral bonus (e.g., 5% of investment)
    const referrer = db.prepare('SELECT referrerId FROM users WHERE id = ?').get(userId) as any;
    if (referrer && referrer.referrerId) {
      const bonusAmount = amount * 0.05;
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(bonusAmount, referrer.referrerId);
      db.prepare(`
        INSERT INTO referrals (referrerId, referredId, bonus, status)
        VALUES (?, ?, ?, 'Paid')
      `).run(referrer.referrerId, userId, bonusAmount);
    }

    res.json({ message: 'Investment successful', invId });
  } catch (error) {
    console.error('Invest Error:', error);
    res.status(500).json({ error: 'Failed to process investment' });
  }
});

// Get referrals
router.get('/referrals', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    let user = db.prepare('SELECT referralCode FROM users WHERE id = ?').get(userId) as any;
    
    // Generate referral code if not exists
    if (!user.referralCode) {
      const code = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase() + userId;
      db.prepare('UPDATE users SET referralCode = ? WHERE id = ?').run(code, userId);
      user.referralCode = code;
    }

    const referredUsers = db.prepare(`
      SELECT u.fullName, u.email, u.createdAt, COALESCE(SUM(r.bonus), 0) as totalBonus
      FROM users u
      LEFT JOIN referrals r ON u.id = r.referredId AND r.referrerId = ?
      WHERE u.referrerId = ?
      GROUP BY u.id
    `).all(userId, userId);

    const totalBonus = referredUsers.reduce((sum: number, u: any) => sum + u.totalBonus, 0);

    res.json({
      referralCode: user.referralCode,
      referredUsers,
      totalBonus
    });
  } catch (error) {
    console.error('Referrals Error:', error);
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

// Create deposit
router.post('/deposit', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { amount, asset } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const txId = 'DEP' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    db.prepare(`
      INSERT INTO transactions (id, userId, type, amount, asset, status)
      VALUES (?, ?, 'deposit', ?, ?, 'Pending')
    `).run(txId, userId, amount, asset || 'USD');

    res.json({ 
      message: 'Deposit request submitted successfully. Please wait for admin approval.', 
      txId
    });
  } catch (error) {
    console.error('Deposit Error:', error);
    res.status(500).json({ error: 'Failed to process deposit' });
  }
});

// NowPayments IPN Callback
router.post('/nowpayments/ipn', async (req, res) => {
  try {
    const ipnData = req.body;
    
    // In a real app, you MUST verify the IPN signature here using NOWPAYMENTS_IPN_SECRET
    // For this demo, we'll trust the incoming data
    
    const { payment_id, payment_status, actually_paid, order_id } = ipnData;
    
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      // Find the pending transaction
      const tx = db.prepare("SELECT * FROM transactions WHERE id = ? AND status = 'Pending'").get(payment_id) as any;
      
      if (tx) {
        // Update transaction status
        db.prepare("UPDATE transactions SET status = 'Completed' WHERE id = ?").run(payment_id);
        
        // Update user balance
        db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.userId);
        
        console.log(`Payment ${payment_id} completed. User ${tx.userId} credited with ${tx.amount}`);
      }
    } else if (payment_status === 'failed' || payment_status === 'expired') {
      db.prepare("UPDATE transactions SET status = 'Failed' WHERE id = ?").run(payment_id);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('IPN Error:', error);
    res.status(500).send('IPN processing failed');
  }
});

// Create withdrawal
router.post('/withdraw', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { amount, asset } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const txId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    db.prepare(`
      INSERT INTO transactions (id, userId, type, amount, asset, status)
      VALUES (?, ?, 'withdrawal', ?, ?, 'Pending')
    `).run(txId, userId, amount, asset || 'USD');

    // Deduct balance immediately for pending withdrawal
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, userId);

    res.json({ message: 'Withdrawal request submitted successfully', txId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// Get user tickets
router.get('/tickets', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const tickets = db.prepare('SELECT * FROM tickets WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket messages
router.get('/tickets/:id/messages', authenticateToken, (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verify ticket belongs to user
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ? AND userId = ?').get(id, userId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messages = db.prepare(`
      SELECT m.*, u.role as senderRole 
      FROM ticket_messages m 
      JOIN users u ON m.senderId = u.id 
      WHERE m.ticketId = ? 
      ORDER BY m.createdAt ASC
    `).all(id);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create ticket
router.post('/tickets', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    
    db.prepare("INSERT INTO tickets (id, userId, subject, status) VALUES (?, ?, ?, 'Open')").run(ticketId, userId, subject);
    db.prepare('INSERT INTO ticket_messages (ticketId, senderId, message) VALUES (?, ?, ?)').run(ticketId, userId, message);

    res.json({ message: 'Ticket created successfully', ticketId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Add message to ticket
router.post('/tickets/:id/messages', authenticateToken, (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify ticket belongs to user
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ? AND userId = ?').get(id, userId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    db.prepare('INSERT INTO ticket_messages (ticketId, senderId, message) VALUES (?, ?, ?)').run(id, userId, message);
    
    // Update ticket status to Open if it was Resolved
    if ((ticket as any).status === 'Resolved') {
      db.prepare("UPDATE tickets SET status = 'Open' WHERE id = ?").run(id);
    }

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
