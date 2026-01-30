import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/theme - Get theme colors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT slider_colors, card_colors FROM settings LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      // Return default colors if no settings found
      return res.json({
        slider_colors: [
          "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500",
          "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
          "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500",
          "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500",
          "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500",
          "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500",
          "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500",
          "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
          "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
          "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500",
          "bg-gradient-to-br from-fuchsia-400 via-purple-400 to-violet-500",
          "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500"
        ],
        card_colors: [
          "bg-pink-100",
          "bg-yellow-100",
          "bg-green-100",
          "bg-blue-100",
          "bg-purple-100",
          "bg-orange-100",
          "bg-teal-100",
          "bg-indigo-100",
          "bg-rose-100",
          "bg-lime-100",
          "bg-cyan-100",
          "bg-amber-100",
          "bg-emerald-100",
          "bg-sky-100",
          "bg-violet-100",
          "bg-fuchsia-100",
          "bg-red-100",
          "bg-slate-100",
          "bg-stone-100",
          "bg-zinc-100"
        ]
      });
    }
    
    res.json({
      slider_colors: result.rows[0].slider_colors,
      card_colors: result.rows[0].card_colors
    });
  } catch (error) {
    console.error('Error fetching theme colors:', error);
    res.status(500).json({ error: 'Failed to fetch theme colors' });
  }
});

// PUT /api/theme - Update theme colors
router.put('/', async (req, res) => {
  try {
    const { slider_colors, card_colors } = req.body;
    
    // Validate input
    if (!Array.isArray(slider_colors) || !Array.isArray(card_colors)) {
      return res.status(400).json({ error: 'slider_colors and card_colors must be arrays' });
    }
    
    // Validate that colors are valid Tailwind classes
    const tailwindColorPattern = /^bg-(gradient-to-[a-z]+\s+from-[a-z]+-\d+\s+(via-[a-z]+-\d+\s+)?to-[a-z]+-\d+|[a-z]+-\d+)$/;
    
    const invalidSliderColors = slider_colors.filter(color => {
      const isGradient = color.startsWith('bg-gradient-to-');
      return !isGradient && !tailwindColorPattern.test(color);
    });
    
    const invalidCardColors = card_colors.filter(color => !tailwindColorPattern.test(color));
    
    if (invalidSliderColors.length > 0 || invalidCardColors.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid Tailwind color classes',
        invalid_slider_colors: invalidSliderColors,
        invalid_card_colors: invalidCardColors
      });
    }
    
    // Update or insert settings
    const result = await pool.query(
      `INSERT INTO settings (id, slider_colors, card_colors) 
       VALUES (1, $1, $2) 
       ON CONFLICT (id) 
       DO UPDATE SET slider_colors = $1, card_colors = $2
       RETURNING slider_colors, card_colors`,
      [JSON.stringify(slider_colors), JSON.stringify(card_colors)]
    );
    
    res.json({
      message: 'Theme colors updated successfully',
      slider_colors: result.rows[0].slider_colors,
      card_colors: result.rows[0].card_colors
    });
  } catch (error) {
    console.error('Error updating theme colors:', error);
    res.status(500).json({ error: 'Failed to update theme colors' });
  }
});

// POST /api/theme/reset - Reset to default colors
router.post('/reset', async (req, res) => {
  try {
    const defaultSliderColors = [
      "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500",
      "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
      "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500",
      "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500",
      "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500",
      "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500",
      "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500",
      "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
      "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
      "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500",
      "bg-gradient-to-br from-fuchsia-400 via-purple-400 to-violet-500",
      "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500"
    ];
    
    const defaultCardColors = [
      "bg-pink-100",
      "bg-yellow-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-purple-100",
      "bg-orange-100",
      "bg-teal-100",
      "bg-indigo-100",
      "bg-rose-100",
      "bg-lime-100",
      "bg-cyan-100",
      "bg-amber-100",
      "bg-emerald-100",
      "bg-sky-100",
      "bg-violet-100",
      "bg-fuchsia-100",
      "bg-red-100",
      "bg-slate-100",
      "bg-stone-100",
      "bg-zinc-100"
    ];
    
    const result = await pool.query(
      `INSERT INTO settings (id, slider_colors, card_colors) 
       VALUES (1, $1, $2) 
       ON CONFLICT (id) 
       DO UPDATE SET slider_colors = $1, card_colors = $2
       RETURNING slider_colors, card_colors`,
      [JSON.stringify(defaultSliderColors), JSON.stringify(defaultCardColors)]
    );
    
    res.json({
      message: 'Theme colors reset to defaults',
      slider_colors: result.rows[0].slider_colors,
      card_colors: result.rows[0].card_colors
    });
  } catch (error) {
    console.error('Error resetting theme colors:', error);
    res.status(500).json({ error: 'Failed to reset theme colors' });
  }
});

export default router;
