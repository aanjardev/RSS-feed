import express from 'express';
import CustomArticle from '../models/CustomArticle.js';

const router = express.Router();

// GET /api/custom-articles - Get all custom articles (with filters)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const filters = {};
    if (req.query.is_published !== undefined) {
      filters.is_published = req.query.is_published === 'true';
    }
    if (req.query.is_featured !== undefined) {
      filters.is_featured = req.query.is_featured === 'true';
    }
    if (req.query.category_id) {
      filters.category_id = parseInt(req.query.category_id);
    }
    if (req.query.search) {
      filters.search = req.query.search;
    }
    
    // If user is kontributor, filter by author_id
    if (req.user && req.user.role === 'kontributor') {
      filters.author_id = req.user.id;
    }

    const result = await CustomArticle.getAll(limit, offset, filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching custom articles:', error);
    res.status(500).json({ error: 'Failed to fetch custom articles' });
  }
});

// GET /api/custom-articles/published - Get published articles for public display
router.get('/published', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const articles = await CustomArticle.getPublished(limit, offset);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching published custom articles:', error);
    res.status(500).json({ error: 'Failed to fetch published articles' });
  }
});

// GET /api/custom-articles/featured - Get featured articles
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const articles = await CustomArticle.getFeatured(limit);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching featured custom articles:', error);
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// GET /api/custom-articles/slug/:slug - Get article by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const result = await CustomArticle.getBySlug(req.params.slug);
    if (!result) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// GET /api/custom-articles/:id - Get single custom article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await CustomArticle.getById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching custom article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST /api/custom-articles - Create new custom article
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      image_url,
      link,
      author,
      source_name,
      category_id,
      is_published,
      is_featured,
      pub_date
    } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const article = await CustomArticle.create({
      title: title.trim(),
      description,
      content,
      image_url,
      link,
      author,
      source_name,
      category_id,
      is_published,
      is_featured,
      pub_date,
      author_id: req.user ? req.user.id : null // Set author_id to current user
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating custom article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// PUT /api/custom-articles/:id - Update custom article
router.put('/:id', async (req, res) => {
  try {
    // Check if kontributor trying to edit someone else's article
    if (req.user && req.user.role === 'kontributor') {
      const existingArticle = await CustomArticle.getById(req.params.id);
      if (!existingArticle || existingArticle.author_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own articles' });
      }
    }
    
    const {
      title,
      description,
      content,
      image_url,
      link,
      author,
      source_name,
      category_id,
      is_published,
      is_featured,
      pub_date
    } = req.body;

    const article = await CustomArticle.update(req.params.id, {
      title,
      description,
      content,
      image_url,
      link,
      author,
      source_name,
      category_id,
      is_published,
      is_featured,
      pub_date
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error updating custom article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// PATCH /api/custom-articles/:id/toggle-published - Toggle published status
router.patch('/:id/toggle-published', async (req, res) => {
  try {
    const article = await CustomArticle.togglePublished(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error toggling published status:', error);
    res.status(500).json({ error: 'Failed to toggle published status' });
  }
});

// PATCH /api/custom-articles/:id/toggle-featured - Toggle featured status
router.patch('/:id/toggle-featured', async (req, res) => {
  try {
    const article = await CustomArticle.toggleFeatured(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

// DELETE /api/custom-articles/:id - Delete custom article
router.delete('/:id', async (req, res) => {
  try {
    // Check if kontributor trying to delete someone else's article
    if (req.user && req.user.role === 'kontributor') {
      const existingArticle = await CustomArticle.getById(req.params.id);
      if (!existingArticle || existingArticle.author_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own articles' });
      }
    }
    
    const article = await CustomArticle.delete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully', article });
  } catch (error) {
    console.error('Error deleting custom article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;
