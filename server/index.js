const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

/* ──────────────────────────────────────────────
   IN-MEMORY FALLBACK STORE
────────────────────────────────────────────── */
const memoryStore = {
  messages: [],
  visitors: [],
  projects: [
    {
      _id: '1',
      title: 'Customer Purchase Behavior Analyzer',
      slug: 'customer-purchase-analyzer',
      description:
        'Data mining system analyzing 5,000+ retail transactions across 8 Ghanaian cities using K-Means clustering, Apriori algorithm, and predictive models (Decision Tree, Random Forest, Logistic Regression).',
      longDescription: '',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
      category: 'data',
      image: '',
      liveUrl: '#',
      githubUrl: 'https://github.com/Pro-Clergy/customer-purchase-analyzer',
      featured: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description:
        'Full-stack online store with user authentication, product catalog, shopping cart, Stripe payment integration, and a responsive admin dashboard.',
      longDescription: '',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'web',
      image: '',
      liveUrl: '#',
      githubUrl: 'https://github.com/Pro-Clergy/e-commerce-platform',
      featured: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      title: 'Task Management Dashboard',
      slug: 'task-management-dashboard',
      description:
        'Collaborative project management tool with real-time updates, drag-and-drop Kanban boards, team assignments, and performance analytics.',
      longDescription: '',
      tags: ['Next.js', 'Tailwind', 'PostgreSQL', 'Socket.io'],
      category: 'web',
      image: '',
      liveUrl: '#',
      githubUrl: 'https://github.com/Pro-Clergy/task-management-dashboard',
      featured: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '4',
      title: 'AI Chatbot for Customer Support',
      slug: 'ai-chatbot-customer-support',
      description:
        'Intelligent conversational AI with NLP capabilities, trained on domain-specific data to handle customer inquiries and automate support workflows.',
      longDescription: '',
      tags: ['Python', 'Flask', 'TensorFlow', 'REST API'],
      category: 'ai',
      image: '',
      liveUrl: '#',
      githubUrl: 'https://github.com/Pro-Clergy/ai-chatbot-customer-support',
      featured: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

/* ──────────────────────────────────────────────
   MONGOOSE SETUP (OPTIONAL)
────────────────────────────────────────────── */
let mongoose;
let Message, Project, Visitor;
let useDatabase = false;

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not set — using in-memory store');
    return;
  }

  try {
    mongoose = require('mongoose');

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    /* Message Model */
    const messageSchema = new mongoose.Schema(
      {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        subject: { type: String, trim: true, default: '' },
        message: { type: String, required: true, maxlength: 5000 },
        read: { type: Boolean, default: false },
      },
      { timestamps: true }
    );

    /* Project Model */
    const projectSchema = new mongoose.Schema(
      {
        title: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        longDescription: { type: String, default: '' },
        tags: [String],
        category: {
          type: String,
          enum: ['web', 'data', 'mobile', 'ai', 'other'],
          default: 'other',
        },
        image: { type: String, default: '' },
        liveUrl: { type: String, default: '' },
        githubUrl: { type: String, default: '' },
        featured: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
      { timestamps: true }
    );

    projectSchema.pre('save', function (next) {
      if (!this.slug) {
        this.slug = this.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      next();
    });

    /* Visitor Model */
    const visitorSchema = new mongoose.Schema({
      page: String,
      referrer: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      ip: { type: String, default: '' },
      country: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now },
    });

    Message = mongoose.model('Message', messageSchema);
    Project = mongoose.model('Project', projectSchema);
    Visitor = mongoose.model('Visitor', visitorSchema);
    useDatabase = true;

    console.log('✅ Connected to MongoDB');

    /* Seed projects if empty */
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(memoryStore.projects.map(({ _id, ...p }) => p));
      console.log('🌱 Seeded default projects');
    }
  } catch (err) {
    console.log(`⚠️  MongoDB connection failed: ${err.message} — using in-memory store`);
    useDatabase = false;
  }
}

/* ──────────────────────────────────────────────
   NODEMAILER SETUP (OPTIONAL)
────────────────────────────────────────────── */
let transporter = null;

function setupEmail() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('⚠️  SMTP credentials not set — email notifications disabled');
    return;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  transporter.verify((err) => {
    if (err) {
      console.log(`⚠️  SMTP verification failed: ${err.message}`);
      transporter = null;
    } else {
      console.log('✅ Email transporter ready');
    }
  });
}

/* ──────────────────────────────────────────────
   MIDDLEWARE
────────────────────────────────────────────── */

/* Trust first proxy (Render, Railway, etc.) so req.ip is accurate */
app.set('trust proxy', 1);

app.use(helmet());

/* CORS — validate origins */
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '10kb' }));

/* Request logging — dev: short, production: combined */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* Rate limiters */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again in an hour.' },
});

app.use('/api', generalLimiter);

/* ──────────────────────────────────────────────
   ROUTES
────────────────────────────────────────────── */

/* Root */
app.get('/', (_req, res) => {
  res.json({
    name: 'Mathias Portfolio API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      contact: '/api/contact (POST)',
      stats: '/api/stats',
    },
  });
});

/* Health check */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: useDatabase ? 'connected' : 'in-memory',
    email: transporter ? 'configured' : 'disabled',
    uptime: process.uptime(),
  });
});

/* Get projects */
app.get('/api/projects', async (_req, res) => {
  try {
    if (useDatabase) {
      const projects = await Project.find({ featured: true }).sort({ order: 1 });
      return res.json(projects);
    }
    const sorted = [...memoryStore.projects]
      .filter((p) => p.featured)
      .sort((a, b) => a.order - b.order);
    res.json(sorted);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/* Contact form */
app.post(
  '/api/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').optional().trim().escape(),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 5000 })
      .withMessage('Message must be under 5000 characters')
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      /* Save message */
      if (useDatabase) {
        await new Message({ name, email, subject, message }).save();
      } else {
        memoryStore.messages.push({
          _id: String(memoryStore.messages.length + 1),
          name,
          email,
          subject: subject || '',
          message,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      /* Send email notification */
      if (transporter) {
        const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: contactEmail,
          subject: `Portfolio: ${subject || 'No Subject'} — from ${name}`,
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e8e6e3;padding:32px;border-radius:16px;">
              <div style="border-bottom:1px solid #1a1a26;padding-bottom:16px;margin-bottom:24px;">
                <h2 style="margin:0;color:#00e5a0;font-size:20px;">New Portfolio Message</h2>
              </div>
              <p style="color:#8a8a9a;margin:4px 0;">From</p>
              <p style="margin:0 0 16px;font-size:16px;">${esc(name)} &lt;${esc(email)}&gt;</p>
              <p style="color:#8a8a9a;margin:4px 0;">Subject</p>
              <p style="margin:0 0 16px;font-size:16px;">${esc(subject) || 'No Subject'}</p>
              <p style="color:#8a8a9a;margin:4px 0;">Message</p>
              <div style="background:#12121a;padding:20px;border-radius:12px;margin-top:8px;line-height:1.7;">
                ${esc(message).replace(/\n/g, '<br>')}
              </div>
              <p style="color:#546e7a;font-size:12px;margin-top:32px;text-align:center;">Sent from your portfolio contact form</p>
            </div>
          `,
        });
      }

      res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
      console.error('Contact error:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
  }
);

/* Track visitor */
app.post('/api/track', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const visitor = { page, referrer: referrer || '', userAgent, ip: String(ip).split(',')[0].trim(), createdAt: new Date() };

    if (useDatabase) {
      await new Visitor(visitor).save();
    } else {
      memoryStore.visitors.push({ _id: String(memoryStore.visitors.length + 1), ...visitor });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).json({ error: 'Tracking failed' });
  }
});

/* Stats */
app.get('/api/stats', async (_req, res) => {
  try {
    if (useDatabase) {
      const [visitors, messages, projects] = await Promise.all([
        Visitor.countDocuments(),
        Message.countDocuments(),
        Project.countDocuments({ featured: true }),
      ]);
      return res.json({ visitors, messages, projects });
    }

    res.json({
      visitors: memoryStore.visitors.length,
      messages: memoryStore.messages.length,
      projects: memoryStore.projects.filter((p) => p.featured).length,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/* ──────────────────────────────────────────────
   API 404 HANDLER
────────────────────────────────────────────── */
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/* ──────────────────────────────────────────────
   DEPLOYMENT NOTE
────────────────────────────────────────────── */
/*
  Deploy client & server SEPARATELY:
  - Frontend (Next.js): Vercel / Netlify — set root to `client/`
  - Backend (Express):  Render / Railway — set root to `server/`, run `node index.js`

  Set these env vars:
  - Server: CLIENT_URL=https://yourdomain.com (comma-separated for multiple origins)
  - Client: NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
*/

/* ──────────────────────────────────────────────
   START SERVER
────────────────────────────────────────────── */
async function start() {
  await connectDatabase();
  setupEmail();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${useDatabase ? 'MongoDB' : 'In-memory'}`);
    console.log(`📧 Email: ${transporter ? 'Enabled' : 'Disabled'}\n`);
  });

  /* Graceful shutdown */
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      if (useDatabase && mongoose) {
        await mongoose.connection.close();
        console.log('📦 Database connection closed');
      }
      console.log('👋 Server stopped');
      process.exit(0);
    });

    /* Force exit after 10s if connections won't close */
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('💥 Fatal startup error:', err);
  process.exit(1);
});
