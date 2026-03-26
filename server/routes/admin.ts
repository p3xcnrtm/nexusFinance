import express from 'express';
import db from '../db.ts';
import { authenticateToken } from './auth.ts';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Get all users
router.get('/users', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const users = db.prepare("SELECT id, fullName, email, phone, country, role, balance, status, kycStatus, createdAt FROM users WHERE role = 'user' ORDER BY createdAt DESC").all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user balance
router.post('/users/:id/balance', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const { amount, action } = req.body; // action: 'add' or 'subtract'

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let newBalance = user.balance;
    if (action === 'add') {
      newBalance += amount;
    } else if (action === 'subtract') {
      newBalance -= amount;
      if (newBalance < 0) newBalance = 0;
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, id);
    res.json({ message: 'Balance updated successfully', newBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update balance' });
  }
});

// Get all transactions
router.get('/transactions', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.*, u.fullName as userName, u.email as userEmail 
      FROM transactions t 
      JOIN users u ON t.userId = u.id 
      ORDER BY t.createdAt DESC
    `).all();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Approve transaction
router.post('/transactions/:id/approve', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (tx.status !== 'Pending') {
      return res.status(400).json({ error: 'Transaction is not pending' });
    }

    db.prepare("UPDATE transactions SET status = 'Completed' WHERE id = ?").run(id);

    // If it's a deposit, add to user balance
    if (tx.type === 'deposit') {
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.userId);
    }

    res.json({ message: 'Transaction approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

// Reject transaction
router.post('/transactions/:id/reject', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (tx.status !== 'Pending') {
      return res.status(400).json({ error: 'Transaction is not pending' });
    }

    db.prepare("UPDATE transactions SET status = 'Rejected' WHERE id = ?").run(id);

    // If it's a withdrawal, refund the user balance
    if (tx.type === 'withdrawal') {
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.userId);
    }

    res.json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});

// Update user status
router.post('/users/:id/status', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: 'Status updated successfully', status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get all KYC documents
router.get('/kyc', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const documents = db.prepare(`
      SELECT k.*, u.fullName as userName, u.email as userEmail 
      FROM kyc_documents k 
      JOIN users u ON k.userId = u.id 
      ORDER BY k.createdAt DESC
    `).all();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KYC documents' });
  }
});

// Approve KYC
router.post('/kyc/:id/approve', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare('SELECT * FROM kyc_documents WHERE id = ?').get(id) as any;

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    db.prepare("UPDATE kyc_documents SET status = 'Approved' WHERE id = ?").run(id);
    db.prepare("UPDATE users SET kycStatus = 'Verified' WHERE id = ?").run(doc.userId);

    res.json({ message: 'KYC approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve KYC' });
  }
});

// Reject KYC
router.post('/kyc/:id/reject', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare('SELECT * FROM kyc_documents WHERE id = ?').get(id) as any;

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    db.prepare("UPDATE kyc_documents SET status = 'Rejected' WHERE id = ?").run(id);
    db.prepare("UPDATE users SET kycStatus = 'Rejected' WHERE id = ?").run(doc.userId);

    res.json({ message: 'KYC rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject KYC' });
  }
});

// Get all announcements
router.get('/announcements', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY createdAt DESC').all();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/announcements', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { title, message, target } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const stmt = db.prepare('INSERT INTO announcements (title, message, target) VALUES (?, ?, ?)');
    const info = stmt.run(title, message, target || 'all');
    
    res.json({ message: 'Announcement created successfully', id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Get all tickets
router.get('/tickets', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const tickets = db.prepare(`
      SELECT t.*, u.fullName as userName 
      FROM tickets t 
      JOIN users u ON t.userId = u.id 
      ORDER BY t.createdAt DESC
    `).all();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket messages
router.get('/tickets/:id/messages', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messages = db.prepare(`
      SELECT m.*, u.role as senderRole, u.fullName as senderName
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

// Add message to ticket
router.post('/tickets/:id/messages', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    db.prepare('INSERT INTO ticket_messages (ticketId, senderId, message) VALUES (?, ?, ?)').run(id, adminId, message);
    
    // Update ticket status to Pending (waiting for user)
    db.prepare("UPDATE tickets SET status = 'Pending' WHERE id = ?").run(id);

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Resolve ticket
router.post('/tickets/:id/resolve', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    db.prepare("UPDATE tickets SET status = 'Resolved' WHERE id = ?").run(id);

    res.json({ message: 'Ticket resolved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
});

export default router;
