import express from 'express';
import Settings from '../models/Settings.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/assets/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|ico|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, ico, svg)'));
    }
  }
});

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getAll();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/settings/public - Get public settings (no auth required)
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.getPublic();
    // Convert to key-value object for easier frontend consumption
    const settingsObj = {};
    settings.forEach(setting => {
      // Convert value based on type
      switch (setting.type) {
        case 'number':
          settingsObj[setting.key] = Number(setting.value);
          break;
        case 'boolean':
          settingsObj[setting.key] = setting.value === 'true';
          break;
        case 'json':
          try {
            settingsObj[setting.key] = JSON.parse(setting.value);
          } catch (e) {
            settingsObj[setting.key] = setting.value;
          }
          break;
        default:
          settingsObj[setting.key] = setting.value;
      }
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
});

// GET /api/settings/category/:category - Get settings by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await Settings.getByCategory(category);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings by category:', error);
    res.status(500).json({ error: 'Failed to fetch settings by category' });
  }
});

// GET /api/settings/:key - Get single setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Settings.get(key);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// PUT /api/settings/:key - Update setting
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // Get current setting to validate type
    const currentSetting = await Settings.get(key);
    if (!currentSetting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    // Validate value based on type
    let validatedValue;
    try {
      validatedValue = Settings.validateType(currentSetting.type, value);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update setting
    const updatedSetting = await Settings.update(key, validatedValue);
    res.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// POST /api/settings - Create new setting
router.post('/', async (req, res) => {
  try {
    const { key, value, type, label, description, category, is_public } = req.body;

    if (!key || !value || !type || !label) {
      return res.status(400).json({ error: 'Missing required fields: key, value, type, label' });
    }

    // Validate value based on type
    let validatedValue;
    try {
      validatedValue = Settings.validateType(type, value);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const newSetting = await Settings.create(
      key,
      validatedValue,
      type,
      label,
      description || '',
      category || 'general',
      is_public || false
    );

    res.status(201).json(newSetting);
  } catch (error) {
    console.error('Error creating setting:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Setting with this key already exists' });
    }
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

// DELETE /api/settings/:key - Delete setting
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const deletedSetting = await Settings.delete(key);
    
    if (!deletedSetting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ message: 'Setting deleted successfully', setting: deletedSetting });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// POST /api/settings/upload - Upload file (favicon, logo, etc.)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { key } = req.body;
    if (!key) {
      // Delete uploaded file if key not provided
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Setting key is required' });
    }

    // Get current setting
    const currentSetting = await Settings.get(key);
    if (!currentSetting) {
      // Delete uploaded file if setting not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Setting not found' });
    }

    // Delete old file if it exists and is not the default
    if (currentSetting.value && currentSetting.value.startsWith('/assets/uploads/')) {
      const oldFilePath = path.join(__dirname, '../../public', currentSetting.value);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update setting with new file path
    const filePath = `/assets/uploads/${req.file.filename}`;
    const updatedSetting = await Settings.update(key, filePath);

    res.json({
      message: 'File uploaded successfully',
      setting: updatedSetting,
      file: {
        filename: req.file.filename,
        path: filePath,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
