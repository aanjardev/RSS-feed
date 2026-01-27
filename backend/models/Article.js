import pool from '../config/database.js';

export const Article = {
  async getAll(limit = 50, offset = 0, sourceId = null) {
    let query = `
      SELECT a.*, s.name as source_name, s.category 
      FROM rss_articles a
      JOIN rss_sources s ON a.source_id = s.id
    `;
    const params = [];
    
    if (sourceId) {
      query += ' WHERE a.source_id = $1';
      params.push(sourceId);
    }
    
    query += ' ORDER BY a.pub_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getBySourceId(sourceId, limit = 20) {
    const result = await pool.query(
      `SELECT a.*, s.name as source_name 
       FROM rss_articles a
       JOIN rss_sources s ON a.source_id = s.id
       WHERE a.source_id = $1 
       ORDER BY a.pub_date DESC 
       LIMIT $2`,
      [sourceId, limit]
    );
    return result.rows;
  },

  async create(article) {
    const { source_id, title, link, description, pub_date, content, image_url, author } = article;
    
    try {
      const result = await pool.query(
        `INSERT INTO rss_articles 
         (source_id, title, link, description, pub_date, content, image_url, author) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [source_id, title, link, description, pub_date, content, image_url, author]
      );
      return result.rows[0];
    } catch (error) {
      // Ignore duplicate entries
      if (error.code === '23505') {
        return null;
      }
      throw error;
    }
  },

  async deleteOld(daysOld = 30) {
    const result = await pool.query(
      `DELETE FROM rss_articles 
       WHERE pub_date < NOW() - INTERVAL '${daysOld} days'`
    );
    return result.rowCount;
  }
};
