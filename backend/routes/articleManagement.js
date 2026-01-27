import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get articles by source with pagination
router.get('/by-source/:sourceId', async (req, res) => {
  try {
    const { sourceId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM rss_articles WHERE source_id = $1',
      [sourceId]
    );
    const totalArticles = parseInt(countResult.rows[0].count);
    
    // Get articles
    const result = await pool.query(
      `SELECT a.*, rs.name as source_name, rs.logo as source_logo
       FROM rss_articles a
       LEFT JOIN rss_sources rs ON a.source_id = rs.id
       WHERE a.source_id = $1
       ORDER BY a.pub_date DESC
       LIMIT $2 OFFSET $3`,
      [sourceId, limit, offset]
    );
    
    res.json({
      success: true,
      articles: result.rows,
      pagination: {
        page,
        limit,
        total: totalArticles,
        totalPages: Math.ceil(totalArticles / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles by source:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, rs.name as source_name, rs.logo as source_logo, rs.url as source_url
       FROM rss_articles a
       LEFT JOIN rss_sources rs ON a.source_id = rs.id
       WHERE a.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      article: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM rss_articles WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete multiple articles
router.post('/delete-bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Article IDs array is required'
      });
    }
    
    const result = await pool.query(
      'DELETE FROM rss_articles WHERE id = ANY($1) RETURNING id',
      [ids]
    );
    
    res.json({
      success: true,
      message: `${result.rows.length} articles deleted successfully`,
      deletedCount: result.rows.length
    });
  } catch (error) {
    console.error('Error bulk deleting articles:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete all articles from a source
router.delete('/by-source/:sourceId', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM rss_articles WHERE source_id = $1 RETURNING id',
      [req.params.sourceId]
    );
    
    res.json({
      success: true,
      message: `${result.rows.length} articles deleted from this source`,
      deletedCount: result.rows.length
    });
  } catch (error) {
    console.error('Error deleting articles by source:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
