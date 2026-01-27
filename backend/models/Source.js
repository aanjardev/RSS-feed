import pool from '../config/database.js';

export const Source = {
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM rss_sources WHERE is_active = true ORDER BY name ASC'
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM rss_sources WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(name, url, category) {
    const result = await pool.query(
      'INSERT INTO rss_sources (name, url, category) VALUES ($1, $2, $3) RETURNING *',
      [name, url, category]
    );
    return result.rows[0];
  },

  async update(id, name, url, category, isActive) {
    const result = await pool.query(
      `UPDATE rss_sources 
       SET name = $1, url = $2, category = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 RETURNING *`,
      [name, url, category, isActive, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM rss_sources WHERE id = $1', [id]);
  }
};
