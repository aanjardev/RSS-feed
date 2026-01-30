import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import sourcesRouter from './routes/sources.js';
import articlesRouter from './routes/articles.js';
import loadMoreRouter from './routes/loadMore.js';
import adminRouter from './routes/admin.js';
import categoriesRouter from './routes/categories.js';
import articleManagementRouter from './routes/articleManagement.js';
import settingsRouter from './routes/settings.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import customArticlesRouter from './routes/customArticles.js';
import uploadRouter from './routes/upload.js';
import commentsRouter from './routes/comments.js';
import themeRouter from './routes/theme.js';
import { startRSSFetcher } from './services/rssFetcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/sources', sourcesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/article-management', articleManagementRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/custom-articles', customArticlesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/theme', themeRouter);
app.use('/load-more', loadMoreRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback route for SPA - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start RSS fetcher cron job
const fetchInterval = parseInt(process.env.FETCH_INTERVAL) || 15;
cron.schedule(`*/${fetchInterval} * * * *`, () => {
  console.log(`[${new Date().toISOString()}] Running RSS fetch...`);
  startRSSFetcher();
});

// Initial fetch on startup
startRSSFetcher();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 RSS fetcher scheduled every ${fetchInterval} minutes`);
});
