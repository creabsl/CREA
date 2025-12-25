const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

// Load env vars
dotenv.config();

const app = express();

// Middleware
// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allowed domains
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:5174',
      process.env.CLIENT_URL, // We will set this on the server
      // Add your Cloudflare URL here later, e.g., 'https://crea-final.pages.dev'
    ];
    
    // checks if the origin is in the allowed list or if it's a preview deployment
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.pages.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Protect document repository uploads (these must be signed-in only)
app.use('/uploads/circulars', protect, express.static(path.join(__dirname, 'uploads', 'circulars')));
app.use('/uploads/manuals', protect, express.static(path.join(__dirname, 'uploads', 'manuals')));
app.use('/uploads/court-cases', protect, express.static(path.join(__dirname, 'uploads', 'court-cases')));

// Static files for other uploaded assets with proper headers for PDF viewing
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
	setHeaders: (res, filePath) => {
		if (filePath.endsWith('.pdf')) {
			res.setHeader('Content-Disposition', 'inline');
			res.setHeader('Content-Type', 'application/pdf');
		}
	}
}));

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
