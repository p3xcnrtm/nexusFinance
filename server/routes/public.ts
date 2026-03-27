import { Router } from 'express';
import db from '../db.ts';

const router = Router();

// Submit Enquiry
router.post('/contact', (req, res) => {
  const { firstName, lastName, email, interest, message } = req.body;

  if (!firstName || !lastName || !email || !interest || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO enquiries (firstName, lastName, email, interest, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(firstName, lastName, email, interest, message);
    
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// Subscribe to Newsletter
router.post('/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email is already subscribed' });
    }

    const stmt = db.prepare(`
      INSERT INTO newsletter_subscribers (email)
      VALUES (?)
    `);
    
    stmt.run(email);
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
