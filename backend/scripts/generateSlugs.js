import pool from '../config/database.js';

// Helper function to generate URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 200); // Limit length
}

async function updateSlugsForExistingArticles() {
  try {
    console.log('🔄 Starting slug generation for existing articles...');
    
    // Get all articles without slugs
    const result = await pool.query(
      'SELECT id, title FROM custom_articles WHERE slug IS NULL OR slug = \'\''
    );
    
    console.log(`📝 Found ${result.rows.length} articles without slugs`);
    
    for (const article of result.rows) {
      let slug = generateSlug(article.title);
      let counter = 1;
      let uniqueSlug = slug;
      
      // Check if slug exists, if so add counter
      while (true) {
        const checkSlug = await pool.query(
          'SELECT id FROM custom_articles WHERE slug = $1 AND id != $2',
          [uniqueSlug, article.id]
        );
        
        if (checkSlug.rows.length === 0) {
          break;
        }
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }
      
      // Update article with slug
      await pool.query(
        'UPDATE custom_articles SET slug = $1 WHERE id = $2',
        [uniqueSlug, article.id]
      );
      
      console.log(`✅ Updated article #${article.id}: "${article.title}" -> slug: "${uniqueSlug}"`);
    }
    
    console.log('🎉 Slug generation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating slugs:', error);
    process.exit(1);
  }
}

updateSlugsForExistingArticles();
