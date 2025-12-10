const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const circularRoutes = require('./routes/circularRoutes');
const manualRoutes = require('./routes/manualRoutes');
const courtCaseRoutes = require('./routes/courtCaseRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const forumRoutes = require('./routes/forumRoutes');
const statsRoutes = require('./routes/statsRoutes');
const mutualTransferRoutes = require('./routes/mutualTransferRoutes');
const externalLinkRoutes = require('./routes/externalLinkRoutes');
const bodyMemberRoutes = require('./routes/bodyMemberRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/circulars', circularRoutes);
app.use('/api/manuals', manualRoutes);
app.use('/api/court-cases', courtCaseRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/mutual-transfers', mutualTransferRoutes);
app.use('/api/external-links', externalLinkRoutes);
app.use('/api/body-members', bodyMemberRoutes);

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
				const r = await seedDemoData()
				const total = Object.values(r).reduce((a, b) => a + b, 0)
				if (total > 0) console.log('Demo data seeding complete.')
			} catch (e) {
				console.warn('Auto-seed failed or already ran:', e?.message || e)
			}
		}

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (err) {
		console.error('Failed to start server:', err?.message || err);
		process.exit(1);
	}
};

start();

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});
