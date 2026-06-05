/**
 * Neural Nexus - Server
 * Express.js backend server with API endpoints
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter limit for API routes
  message: { error: 'Too many submissions, please try again later.' },
});

app.use('/api/', limiter);

// ===== IN-MEMORY STORAGE (Replace with database in production) =====
const subscribers = [];
const contacts = [];

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Subscribe to newsletter
app.post('/api/subscribe', apiLimiter, (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicates
    const exists = subscribers.find(s => s.email === normalizedEmail);
    if (exists) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    // Store subscriber
    const subscriber = {
      id: subscribers.length + 1,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      source: 'newsletter'
    };

    subscribers.push(subscriber);

    console.log(`[SUBSCRIBE] New subscriber: ${normalizedEmail}`);

    res.status(201).json({
      message: 'Successfully subscribed!',
      subscriber: { id: subscriber.id, email: subscriber.email }
    });

  } catch (error) {
    console.error('[SUBSCRIBE ERROR]', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscriber count (for demo purposes)
app.get('/api/subscribers/count', (req, res) => {
  res.json({ count: subscribers.length });
});

// Contact form submission
app.post('/api/contact', apiLimiter, (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Store contact
    const contact = {
      id: contacts.length + 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    contacts.push(contact);

    console.log(`[CONTACT] New message from: ${contact.name} (${contact.email})`);
    console.log(`[CONTACT] Subject: ${contact.subject}`);

    res.status(201).json({
      message: 'Message sent successfully!',
      contactId: contact.id
    });

  } catch (error) {
    console.error('[CONTACT ERROR]', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact count (for demo purposes)
app.get('/api/contacts/count', (req, res) => {
  res.json({ count: contacts.length });
});

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
}));

// Fallback to index.html for SPA-like behavior
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🧠 Neural Nexus Server                                ║
║                                                           ║
║   Local:   http://localhost:${PORT}                        ║
║   API:     http://localhost:${PORT}/api                    ║
║                                                           ║
║   Endpoints:                                            ║
║   • GET  /api/health     - Health check                  ║
║   • POST /api/subscribe  - Newsletter subscription        ║
║   • POST /api/contact    - Contact form submission        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
