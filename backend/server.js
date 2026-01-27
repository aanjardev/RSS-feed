import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import sourcesRouter from './routes/sources.js';
import articlesRouter from './routes/articles.js';
import loadMoreRouter from './routes/loadMore.js';
import adminRouter from './routes/admin.js';
import { startRSSFetcher } from './services/rssFetcher.js';

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

// Routes
app.use('/api/sources', sourcesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/admin', adminRouter);
app.use('/load-more', loadMoreRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
