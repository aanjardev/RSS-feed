import pool from '../config/database.js';

export const Category = {
  async getAll(includeInactive = false) {
    const query = includeInactive 
      ? 'SELECT * FROM categories ORDER BY name ASC'
      : 'SELECT * FROM categories WHERE is_active = true ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(name, slug, description, icon, color) {
    const result = await pool.query(
      `INSERT INTO categories (name, slug, description, icon, color) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, slug, description, icon, color]
    );
    return result.rows[0];
  },

  async update(id, name, slug, description, icon, color, isActive) {
    const result = await pool.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           description = COALESCE($3, description),
           icon = COALESCE($4, icon),
           color = COALESCE($5, color),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, slug, description, icon, color, isActive, id]
    );
    return result.rows[0];
  },

  async toggleActive(id) {
    const result = await pool.query(
      `UPDATE categories 
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async delete(id) {
    // Set category_id to NULL for all sources using this category
    await pool.query(
      'UPDATE rss_sources SET category_id = NULL WHERE category_id = $1',
      [id]
    );
    
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getSourceCount(id) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM rss_sources WHERE category_id = $1',
      [id]
    );
    return parseInt(result.rows[0].count);
  }
};
