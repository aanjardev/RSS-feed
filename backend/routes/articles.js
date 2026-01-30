import express from 'express';
import { Article } from '../models/Article.js';
import CustomArticle from '../models/CustomArticle.js';
import pool from '../config/database.js';

const router = express.Router();

// GET all articles with pagination (includes custom articles)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const sourceId = req.query.source_id || null;
    
    let allArticles = [];
    
    // Check if filtering by custom source
    if (sourceId && sourceId.startsWith('custom-')) {
      // Extract source name from custom ID
      // Decode from base64 if it exists, otherwise use old format
      let sourceName;
      const idPart = sourceId.replace('custom-', '');
      
      try {
        // Try to decode from base64
        sourceName = Buffer.from(idPart, 'base64').toString('utf-8');
      } catch {
        // Fallback: convert dashes to spaces and capitalize
        sourceName = idPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
      const articles = await CustomArticle.getBySourceName(sourceName, limit);
      allArticles = articles.map(ca => ({
        ...ca,
        source_name: ca.source_name || 'Editorial',
        is_custom: true
      }));
    } else {
      // Get RSS articles
      const rssArticles = await Article.getAll(limit, offset, sourceId);
      
      // Get published custom articles only if no specific source filter
      allArticles = [...rssArticles];
      if (!sourceId) {
        const customResult = await CustomArticle.getAll(limit, 0, { is_published: true });
        const customArticles = customResult.articles.map(ca => ({
          ...ca,
          source_name: ca.source_name || 'Editorial',
          is_custom: true
        }));
        
        // Combine and sort by pub_date
        allArticles = [...rssArticles, ...customArticles]
          .sort((a, b) => new Date(b.pub_date) - new Date(a.pub_date))
          .slice(offset, offset + limit);
      }
    }
    
    res.json({
      articles: allArticles,
      limit,
      offset,
      count: allArticles.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET articles by source ID or custom source name
router.get('/source/:sourceId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const sourceId = req.params.sourceId;
    
    // Check if it's a custom source (starts with 'custom-')
    if (sourceId.startsWith('custom-')) {
      // Extract the source name from the custom ID
      let sourceName;
      const idPart = sourceId.replace('custom-', '');
      
      try {
        // Try to decode from base64
        sourceName = Buffer.from(idPart, 'base64').toString('utf-8');
      } catch {
        // Fallback: convert dashes to spaces and capitalize
        sourceName = idPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
      const articles = await CustomArticle.getBySourceName(sourceName, limit);
      const formattedArticles = articles.map(ca => ({
        ...ca,
        source_name: ca.source_name || 'Editorial',
        is_custom: true
      }));
      res.json(formattedArticles);
    } else {
      // Regular RSS source
      const articles = await Article.getBySourceId(sourceId, limit);
      res.json(articles);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all sources with article count (includes custom articles as sources)
router.get('/sources', async (req, res) => {
  try {
    // Get RSS sources
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
    
    const rssResult = await pool.query(query);
    
    // Get custom article sources (group by source_name)
    const customQuery = `
      SELECT 
        source_name as name,
        COUNT(*) as article_count,
        MAX(pub_date) as latest_article
      FROM custom_articles
      WHERE is_published = true AND source_name IS NOT NULL
      GROUP BY source_name
    `;
    
    const customResult = await pool.query(customQuery);
    
    // Combine sources - add custom sources with custom ID using base64 encoding
    const allSources = [
      ...rssResult.rows,
      ...customResult.rows.map(cs => ({
        id: `custom-${Buffer.from(cs.name).toString('base64')}`,
        name: cs.name,
        url: null,
        logo: null,
        description: null,
        category: 'Editorial',
        article_count: parseInt(cs.article_count),
        latest_article: cs.latest_article,
        is_custom: true,
        source_name: cs.name
      }))
    ];
    
    res.json({
      success: true,
      count: allSources.length,
      sources: allSources
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
