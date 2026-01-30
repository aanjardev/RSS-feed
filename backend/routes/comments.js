import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Generate random guest name
function generateGuestName() {
  const adjectives = ['Happy', 'Smart', 'Brave', 'Kind', 'Cool', 'Swift', 'Wise', 'Bold', 'Bright', 'Calm'];
  const nouns = ['Panda', 'Eagle', 'Tiger', 'Dolphin', 'Phoenix', 'Dragon', 'Wolf', 'Fox', 'Bear', 'Lion'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 9999);
  return `${randomAdj}${randomNoun}${randomNum}`;
}

// GET /api/comments/:articleId - Get all comments for an article
router.get('/:articleId', async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId);
    
    const result = await pool.query(
      `SELECT id, guest_name, comment_text, created_at, is_approved
       FROM article_comments
       WHERE article_id = $1 AND is_approved = true
       ORDER BY created_at DESC`,
      [articleId]
    );
    
    res.json({
      success: true,
      comments: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments - Add new comment
router.post('/', async (req, res) => {
  try {
    const { article_id, comment_text, guest_name } = req.body;
    
    // Validation
    if (!article_id || !comment_text) {
      return res.status(400).json({ error: 'Article ID and comment text are required' });
    }
    
    if (comment_text.trim().length < 3) {
      return res.status(400).json({ error: 'Comment must be at least 3 characters' });
    }
    
    if (comment_text.length > 1000) {
      return res.status(400).json({ error: 'Comment must be less than 1000 characters' });
    }
    
    // Generate guest name if not provided
    const finalGuestName = guest_name && guest_name.trim() 
      ? guest_name.trim() 
      : generateGuestName();
    
    // Get IP address (for spam prevention)
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const result = await pool.query(
      `INSERT INTO article_comments (article_id, guest_name, comment_text, ip_address)
       VALUES ($1, $2, $3, $4)
       RETURNING id, guest_name, comment_text, created_at, is_approved`,
      [article_id, finalGuestName, comment_text.trim(), ipAddress]
    );
    
    res.json({
      success: true,
      comment: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// DELETE /api/comments/:id - Delete comment (admin only - can be added later)
router.delete('/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    
    await pool.query('DELETE FROM article_comments WHERE id = $1', [commentId]);
    
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
