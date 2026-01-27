import { pool } from '../config/database.js';

class Settings {
  // Get all settings
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM settings ORDER BY category, key'
    );
    return result.rows;
  }

  // Get settings by category
  static async getByCategory(category) {
    const result = await pool.query(
      'SELECT * FROM settings WHERE category = $1 ORDER BY key',
      [category]
    );
    return result.rows;
  }

  // Get only public settings (accessible by frontend)
  static async getPublic() {
    const result = await pool.query(
      'SELECT key, value, type FROM settings WHERE is_public = true ORDER BY key'
    );
    return result.rows;
  }

  // Get single setting by key
  static async get(key) {
    const result = await pool.query(
      'SELECT * FROM settings WHERE key = $1',
      [key]
    );
    return result.rows[0];
  }

  // Update setting value
  static async update(key, value) {
    const result = await pool.query(
      'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *',
      [value, key]
    );
    return result.rows[0];
  }

  // Create new setting
  static async create(key, value, type, label, description, category = 'general', isPublic = false) {
    const result = await pool.query(
      `INSERT INTO settings (key, value, type, label, description, category, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [key, value, type, label, description, category, isPublic]
    );
    return result.rows[0];
  }

  // Delete setting
  static async delete(key) {
    const result = await pool.query(
      'DELETE FROM settings WHERE key = $1 RETURNING *',
      [key]
    );
    return result.rows[0];
  }

  // Validate setting value based on type
  static validateType(type, value) {
    switch (type) {
      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error('Value must be a valid number');
        }
        return String(num);
      
      case 'boolean':
        if (value !== 'true' && value !== 'false') {
          throw new Error('Value must be true or false');
        }
        return value;
      
      case 'json':
        try {
          JSON.parse(value);
          return value;
        } catch (e) {
          throw new Error('Value must be valid JSON');
        }
      
      case 'string':
      case 'file':
      default:
        return String(value);
    }
  }

  // Get setting value with type conversion
  static async getValue(key) {
    const setting = await this.get(key);
    if (!setting) return null;

    switch (setting.type) {
      case 'number':
        return Number(setting.value);
      case 'boolean':
        return setting.value === 'true';
      case 'json':
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  }
}

export default Settings;
