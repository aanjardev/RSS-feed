import express from 'express';
import { Source } from '../models/Source.js';

const router = express.Router();

// GET all sources
router.get('/', async (req, res) => {
  try {
    const sources = await Source.getAll();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET source by ID
router.get('/:id', async (req, res) => {
  try {
    const source = await Source.getById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new source
router.post('/', async (req, res) => {
  try {
    const { name, url, category } = req.body;
    const source = await Source.create(name, url, category);
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update source
router.put('/:id', async (req, res) => {
  try {
    const { name, url, category, is_active } = req.body;
    const source = await Source.update(req.params.id, name, url, category, is_active);
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE source
router.delete('/:id', async (req, res) => {
  try {
    await Source.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
