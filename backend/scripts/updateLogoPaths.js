import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateLogoPaths() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating logo paths in database...\n');
    
    // Read updated rss-feeds.json dengan path lokal
    const rssFeeds = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../rss-feeds.json'), 'utf8')
    );
    
    for (const feed of rssFeeds) {
      if (!feed.logo || feed.logo === '#') continue;
      
      // Update logo path berdasarkan ID atau name
      const result = await client.query(
        `UPDATE rss_sources 
         SET logo = $1 
         WHERE LOWER(REPLACE(name, ' ', '-')) = $2 OR name ILIKE $3`,
        [feed.logo, feed.id, `%${feed.name}%`]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ Updated: ${feed.name} -> ${feed.logo}`);
      } else {
        console.log(`⚠️  Not found in DB: ${feed.name}`);
      }
    }
    
    console.log('\n✅ Database logo paths updated!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateLogoPaths();
