import express from 'express';
import { Article } from '../models/Article.js';
import pool from '../config/database.js';

const router = express.Router();

// GET all articles with pagination
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const sourceId = req.query.source_id || null;
    
    const articles = await Article.getAll(limit, offset, sourceId);
    res.json({
      articles,
      limit,
      offset,
      count: articles.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET articles by source ID
router.get('/source/:sourceId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const articles = await Article.getBySourceId(req.params.sourceId, limit);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all sources with article count
router.get('/sources', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id,
        s.name,
        s.url,
        s.logo,
        s.description,
        s.category,
        COUNT(a.id) as article_count,
        MAX(a.pub_date) as latest_article
      FROM rss_sources s
      LEFT JOIN rss_articles a ON s.id = a.source_id
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      count: result.rows.length,
      sources: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sources'
    });
  }
});

export default router;
