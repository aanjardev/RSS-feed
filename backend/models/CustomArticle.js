import pool from '../config/database.js';

// Helper function to generate URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 200); // Limit length
}

class CustomArticle {
  // Get all custom articles with pagination and filters
  static async getAll(limit = 50, offset = 0, filters = {}) {
    try {
      let query = `
        SELECT ca.*, c.name as category_name
        FROM custom_articles ca
        LEFT JOIN categories c ON ca.category_id = c.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      // Filter by published status
      if (filters.is_published !== undefined) {
        query += ` AND ca.is_published = $${paramIndex}`;
        params.push(filters.is_published);
        paramIndex++;
      }

      // Filter by featured status
      if (filters.is_featured !== undefined) {
        query += ` AND ca.is_featured = $${paramIndex}`;
        params.push(filters.is_featured);
        paramIndex++;
      }

      // Filter by category
      if (filters.category_id) {
        query += ` AND ca.category_id = $${paramIndex}`;
        params.push(filters.category_id);
        paramIndex++;
      }
      
      // Filter by author_id (for kontributor role)
      if (filters.author_id) {
        query += ` AND ca.author_id = $${paramIndex}`;
        params.push(filters.author_id);
        paramIndex++;
      }

      // Search in title and description
      if (filters.search) {
        query += ` AND (ca.title ILIKE $${paramIndex} OR ca.description ILIKE $${paramIndex})`;
        params.push(`%${filters.search}%`);
        paramIndex++;
      }

      query += ` ORDER BY ca.pub_date DESC, ca.created_at DESC`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM custom_articles WHERE 1=1';
      const countParams = [];
      let countIndex = 1;
      
      if (filters.is_published !== undefined) {
        countQuery += ` AND is_published = $${countIndex}`;
        countParams.push(filters.is_published);
        countIndex++;
      }
      if (filters.is_featured !== undefined) {
        countQuery += ` AND is_featured = $${countIndex}`;
        countParams.push(filters.is_featured);
        countIndex++;
      }
      if (filters.category_id) {
        countQuery += ` AND category_id = $${countIndex}`;
        countParams.push(filters.category_id);
        countIndex++;
      }
      if (filters.author_id) {
        countQuery += ` AND author_id = $${countIndex}`;
        countParams.push(filters.author_id);
        countIndex++;
      }
      if (filters.search) {
        countQuery += ` AND (title ILIKE $${countIndex} OR description ILIKE $${countIndex})`;
        countParams.push(`%${filters.search}%`);
      }

      const countResult = await pool.query(countQuery, countParams);

      return {
        articles: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      };
    } catch (error) {
      console.error('Error getting custom articles:', error);
      throw error;
    }
  }

  // Get single article by ID
  // Get single article by ID
  static async getById(id) {
    try {
      const result = await pool.query(
        `SELECT ca.*, c.name as category_name
         FROM custom_articles ca
         LEFT JOIN categories c ON ca.category_id = c.id
         WHERE ca.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting custom article by ID:', error);
      throw error;
    }
  }

  // Get articles by source name
  static async getBySourceName(sourceName, limit = 20) {
    try {
      const result = await pool.query(
        `SELECT ca.*, c.name as category_name
         FROM custom_articles ca
         LEFT JOIN categories c ON ca.category_id = c.id
         WHERE ca.source_name = $1 AND ca.is_published = true
         ORDER BY ca.pub_date DESC, ca.created_at DESC
         LIMIT $2`,
        [sourceName, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting articles by source name:', error);
      throw error;
    }
  }

  // Get article by slug
  static async getBySlug(slug) {
    try {
      const result = await pool.query(
        `SELECT ca.*, c.name as category_name
         FROM custom_articles ca
         LEFT JOIN categories c ON ca.category_id = c.id
         WHERE ca.slug = $1 AND ca.is_published = true`,
        [slug]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting article by slug:', error);
      throw error;
    }
  }

  // Create new custom article
  static async create(articleData) {
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
        pub_date,
        author_id
      } = articleData;

      // Generate unique slug
      let slug = generateSlug(title);
      let slugExists = true;
      let counter = 1;
      
      // Check if slug exists, if so add counter
      while (slugExists) {
        const checkSlug = await pool.query(
          'SELECT id FROM custom_articles WHERE slug = $1',
          [counter > 1 ? `${slug}-${counter}` : slug]
        );
        
        if (checkSlug.rows.length === 0) {
          slug = counter > 1 ? `${slug}-${counter}` : slug;
          slugExists = false;
        } else {
          counter++;
        }
      }

      const result = await pool.query(
        `INSERT INTO custom_articles (
          title, description, content, image_url, link, author,
          source_name, category_id, is_published, is_featured, pub_date, slug, author_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          title,
          description || null,
          content || null,
          image_url || null,
          link || null,
          author || null,
          source_name || 'Editorial',
          category_id || null,
          is_published !== undefined ? is_published : true,
          is_featured !== undefined ? is_featured : false,
          pub_date || new Date(),
          slug,
          author_id || null
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating custom article:', error);
      throw error;
    }
  }

  // Update custom article
  static async update(id, articleData) {
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
      } = articleData;

      const result = await pool.query(
        `UPDATE custom_articles SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          content = COALESCE($3, content),
          image_url = COALESCE($4, image_url),
          link = COALESCE($5, link),
          author = COALESCE($6, author),
          source_name = COALESCE($7, source_name),
          category_id = COALESCE($8, category_id),
          is_published = COALESCE($9, is_published),
          is_featured = COALESCE($10, is_featured),
          pub_date = COALESCE($11, pub_date)
        WHERE id = $12
        RETURNING *`,
        [
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
          pub_date,
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating custom article:', error);
      throw error;
    }
  }

  // Delete custom article
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM custom_articles WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting custom article:', error);
      throw error;
    }
  }

  // Toggle published status
  static async togglePublished(id) {
    try {
      const result = await pool.query(
        `UPDATE custom_articles 
         SET is_published = NOT is_published 
         WHERE id = $1 
         RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error toggling published status:', error);
      throw error;
    }
  }

  // Toggle featured status
  static async toggleFeatured(id) {
    try {
      const result = await pool.query(
        `UPDATE custom_articles 
         SET is_featured = NOT is_featured 
         WHERE id = $1 
         RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }

  // Get published articles for public display (mixed with RSS articles)
  static async getPublished(limit = 20, offset = 0) {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          title,
          description,
          image_url,
          link,
          source_name,
          pub_date,
          'custom' as source_type
         FROM custom_articles
         WHERE is_published = true
         ORDER BY pub_date DESC, created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting published custom articles:', error);
      throw error;
    }
  }

  // Get featured articles
  static async getFeatured(limit = 5) {
    try {
      const result = await pool.query(
        `SELECT * FROM custom_articles
         WHERE is_published = true AND is_featured = true
         ORDER BY pub_date DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting featured custom articles:', error);
      throw error;
    }
  }
}

export default CustomArticle;
