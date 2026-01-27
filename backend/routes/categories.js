import express from 'express';
import pool from '../config/database.js';
import { Category } from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll(true); // Include inactive
    
    // Get source count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => ({
        ...cat,
        source_count: await Category.getSourceCount(cat.id)
      }))
    );
    
    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const sourceCount = await Category.getSourceCount(category.id);
    
    res.json({
      success: true,
      category: {
        ...category,
        source_count: sourceCount
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const { name, slug, description, icon, color } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }
    
    const category = await Category.create(
      name,
      slug,
      description || null,
      icon || null,
      color || '#3b82f6'
    );
    
    res.json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: 'Category name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { name, slug, description, icon, color, is_active } = req.body;
    
    const category = await Category.update(
      req.params.id,
      name,
      slug,
      description,
      icon,
      color,
      is_active
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Category name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const category = await Category.toggleActive(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: `Category ${category.is_active ? 'activated' : 'deactivated'}`,
      category
    });
  } catch (error) {
    console.error('Error toggling category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.delete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
