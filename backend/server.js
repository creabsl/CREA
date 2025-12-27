const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

// Load env vars
dotenv.config();

const app = express();

const frontendDistPath = path.join(__dirname, '..', 'Frontend', 'dist');
const fs = require('fs');

// Middleware
// Build allowed origins list from config and env
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5001',
  'https://crea.org.in',
  'https://www.crea.org.in',
];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow exact matches or common preview hosts
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes('.pages.dev')
    ) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Standard CORS middleware
app.use(cors(corsOptions));

// Also add a defensive middleware that always sets common CORS response headers
// when the request Origin is allowed. This ensures headers are present even
// when some downstream handler returns an error/redirect.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  try {
    if (
      origin &&
      (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.pages.dev'))
    ) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS'
      );
    }
  } catch (e) {
    /* ignore header errors */
  }
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve frontend static assets BEFORE API routes (no auth needed for public assets)
if (fs.existsSync(frontendDistPath)) {
	app.use(express.static(frontendDistPath, {
		setHeaders: (res, filePath) => {
			// Set correct MIME types
			if (filePath.endsWith('.js')) {
				res.setHeader('Content-Type', 'application/javascript');
			} else if (filePath.endsWith('.css')) {
				res.setHeader('Content-Type', 'text/css');
			}
		}
	}));
}

// Serve document uploads (protected ones still use protect middleware via routes)
app.use(
  '/uploads/circulars',
  express.static(path.join(__dirname, 'uploads', 'circulars'))
);
app.use(
  '/uploads/manuals',
  express.static(path.join(__dirname, 'uploads', 'manuals'))
);
app.use(
  '/uploads/court-cases',
  express.static(path.join(__dirname, 'uploads', 'court-cases'))
);

// Static files for other uploaded assets with proper headers for PDF viewing
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Type', 'application/pdf');
      }
    },
  })
);

// Routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const circularRoutes = require('./routes/circularRoutes');
const manualRoutes = require('./routes/manualRoutes');
const courtCaseRoutes = require('./routes/courtCaseRoutes');
const documentRoutes = require('./routes/documentRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const forumRoutes = require('./routes/forumRoutes');
const statsRoutes = require('./routes/statsRoutes');
const mutualTransferRoutes = require('./routes/mutualTransferRoutes');
const externalLinkRoutes = require('./routes/externalLinkRoutes');
const bodyMemberRoutes = require('./routes/bodyMemberRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingRoutes = require('./routes/settingRoutes');
const donationRoutes = require('./routes/donationRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const eventAdRoutes = require('./routes/eventAdRoutes');
const breakingNewsRoutes = require('./routes/breakingNewsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/circulars', circularRoutes);
app.use('/api/manuals', manualRoutes);
app.use('/api/court-cases', courtCaseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/mutual-transfers', mutualTransferRoutes);
app.use('/api/external-links', externalLinkRoutes);
app.use('/api/body-members', bodyMemberRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/event-ads', eventAdRoutes);
app.use('/api/breaking-news', breakingNewsRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Catch-all handler for client-side routing (SPA)
// Only match routes that are NOT static files or API endpoints
if (fs.existsSync(frontendDistPath)) {
	app.get(/^\/(?!api|uploads|health|assets|.*\.[a-z0-9]+$).*/, (req, res) => {
		res.sendFile(path.join(frontendDistPath, 'index.html'));
	});
}

const PORT = process.env.PORT || 5001;

// Start server only after DB connection
const start = async () => {
	try {
		await connectDB();

		// Optional auto-seed for demo
		if (String(process.env.SEED_ON_START).toLowerCase() === 'true') {
			try {
				const { seedDemoData } = require('./scripts/seed')
				await seedDemoData()
			} catch (e) {
				// Silent fail
			}
		}

		app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
	} catch (err) {
		console.error('Failed to start server:', err?.message || err);
		process.exit(1);
	}
};

start();

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});
