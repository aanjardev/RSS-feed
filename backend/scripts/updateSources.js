import pool from '../config/database.js';

async function updateSources() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating RSS sources...');
    
    // Add new columns if not exist
    await client.query(`
      ALTER TABLE rss_sources 
      ADD COLUMN IF NOT EXISTS logo TEXT,
      ADD COLUMN IF NOT EXISTS description TEXT
    `);
    
    // Clear old sources
    await client.query('DELETE FROM rss_sources');
    console.log('✅ Cleared old sources');
    
    // Insert Indonesian RSS sources
    const sources = [
      ['Tempo Bisnis', 'https://rss.tempo.co/bisnis', 'http://www.tilikfeed.com/logos/icons/tempo.png', 'Tempo.co Berita Bisnis Terkini Indonesia dan Dunia RSS', 'Business'],
      ['Liputan 6', 'https://feed.liputan6.com/rss/news', 'http://www.tilikfeed.com/logos/icons/liputan6.jpeg', 'Liputan6.com Politik', 'News'],
      ['Tribunnews', 'https://www.tribunnews.com/rss', 'http://www.tilikfeed.com/logos/icons/tribunnews.png', 'Tribunnews.com', 'News'],
      ['CNBC Market', 'https://www.cnbcindonesia.com/market/rss/', 'http://www.tilikfeed.com/logos/icons/CNBC_Indonesia.png', 'Market - Berita Terkini Market, Saham, Reksadana - CNBC Indonesia', 'Business'],
      ['Tempo Nasional', 'https://rss.tempo.co/nasional', 'http://www.tilikfeed.com/logos/icons/tempo.png', 'Tempo.co Berita Nasional Terbaru Indonesia Hari Ini RSS', 'News'],
      ['Republika', 'https://www.republika.co.id/rss', 'http://www.tilikfeed.com/logos/icons/republika.png', 'Republika Online RSS Feed', 'News'],
      ['Okezone', 'https://sindikasi.okezone.com/index.php/rss/0/RSS2.0', 'http://www.tilikfeed.com/logos/icons/okezone.png', 'Sindikasi economy.okezone.com', 'Business'],
      ['Tirto', 'https://tirto.id/sitemap/r/google-discover', 'http://www.tilikfeed.com/logos/icons/tirto.png', 'tirto.id', 'News'],
      ['Detik News', 'https://news.detik.com/berita/rss', 'http://www.tilikfeed.com/logos/icons/detik.png', 'Berita - Detikcom', 'News'],
      ['Detik Finance', 'https://finance.detik.com/rss', 'http://www.tilikfeed.com/logos/icons/detik.png', 'Finance - Detikcom', 'Business'],
      ['Viva', 'https://www.viva.co.id/get/all', 'http://www.tilikfeed.com/logos/icons/viva1.png', 'VIVA - Berita Harian Terkini, Terpopuler, Terbaru', 'News'],
      ['Kumparan', 'https://lapi.kumparan.com/v2.0/rss/', 'http://www.tilikfeed.com/logos/icons/kumparan2.png', 'kumparan - #kumparanAdalahJawaban', 'News'],
      ['Suara Pembaharuan', 'https://www.suarapembaharuan.com/feeds/posts/default', 'http://www.tilikfeed.com/logos/icons/suara-pembaharuan.png', 'Suara Pembaharuan', 'News'],
      ['SindoNews', 'https://www.sindonews.com/feed', 'http://www.tilikfeed.com/logos/icons/sindonews1.png', 'Berita Terkini dan Informasi Terbaru Hari Ini - SINDOnews', 'News'],
      ['CNBC News', 'https://www.cnbcindonesia.com/news/rss', 'http://www.tilikfeed.com/logos/icons/CNBC_Indonesia.png', 'News - Berita Terkini Indonesia dan Dunia - CNBC Indonesia', 'News'],
      ['CNN Nasional', 'https://www.cnnindonesia.com/nasional/rss', 'http://www.tilikfeed.com/logos/icons/CNN_Indonesia.png', 'CNN Indonesia | Berita Terkini Nasional', 'News'],
      ['CNN Ekonomi', 'https://www.cnnindonesia.com/ekonomi/rss', 'http://www.tilikfeed.com/logos/icons/CNN_Indonesia.png', 'CNN Indonesia | Berita Terkini Ekonomi', 'Business'],
      ['Antara', 'https://www.antaranews.com/rss/top-news', 'http://www.tilikfeed.com/logos/icons/antaranews2.png', 'Berita Top News - ANTARA News', 'News'],
    ];
    
    for (const [name, url, logo, description, category] of sources) {
      await client.query(
        `INSERT INTO rss_sources (name, url, logo, description, category, is_active) 
         VALUES ($1, $2, $3, $4, $5, true)`,
        [name, url, logo, description, category]
      );
      console.log(`✅ Added: ${name}`);
    }
    
    console.log('\n🎉 Successfully updated all RSS sources!');
    
  } catch (error) {
    console.error('❌ Error updating sources:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateSources();
