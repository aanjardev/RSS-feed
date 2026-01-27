import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all RSS sources (include inactive)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COUNT(a.id) as article_count,
        MAX(a.pub_date) as latest_article
      FROM rss_sources s
      LEFT JOIN rss_articles a ON s.id = a.source_id
      GROUP BY s.id
      ORDER BY s.name ASC
    `);
    
    res.json({
      success: true,
      sources: result.rows
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single source by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rss_sources WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    
    res.json({
      success: true,
      source: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching source:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new RSS source
router.post('/', async (req, res) => {
  try {
    const { name, url, logo, description, category, is_active } = req.body;
    
    // Validation
    if (!name || !url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and URL are required' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO rss_sources (name, url, logo, description, category, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, url, logo || null, description || null, category || 'News', is_active !== false]
    );
    
    res.json({
      success: true,
      source: result.rows[0],
      message: 'RSS source created successfully'
    });
  } catch (error) {
    console.error('Error creating source:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update RSS source
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, logo, description, category, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE rss_sources 
       SET name = COALESCE($1, name),
           url = COALESCE($2, url),
           logo = COALESCE($3, logo),
           description = COALESCE($4, description),
           category = COALESCE($5, category),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, url, logo, description, category, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    
    res.json({
      success: true,
      source: result.rows[0],
      message: 'RSS source updated successfully'
    });
  } catch (error) {
    console.error('Error updating source:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `UPDATE rss_sources 
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    
    res.json({
      success: true,
      source: result.rows[0],
      message: `RSS source ${result.rows[0].is_active ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    console.error('Error toggling source:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete RSS source
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM rss_sources WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    
    res.json({
      success: true,
      message: 'RSS source deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting source:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test RSS URL (validate before adding)
router.post('/test', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    // Import parser dynamically to test
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser();
    
    const feed = await parser.parseURL(url);
    
    res.json({
      success: true,
      feed: {
        title: feed.title,
        description: feed.description,
        itemCount: feed.items?.length || 0,
        items: feed.items?.slice(0, 3).map(item => ({
          title: item.title,
          link: item.link
        }))
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid RSS feed',
      details: error.message 
    });
  }
});

export default router;
