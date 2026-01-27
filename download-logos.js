import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read RSS feeds
const rssFeeds = JSON.parse(fs.readFileSync(path.join(__dirname, 'rss-feeds.json'), 'utf8'));

// Create logos directory if not exists
const logosDir = path.join(__dirname, 'src/assets/logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(logosDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`✅ ${filename} already exists`);
      resolve(filename);
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Download all logos
async function downloadAllLogos() {
  console.log('📥 Downloading logos...\n');
  
  const downloads = [];
  const logoMap = {};
  
  for (const feed of rssFeeds) {
    if (feed.logo && feed.logo !== '#') {
      const ext = path.extname(new URL(feed.logo).pathname) || '.png';
      const filename = `${feed.id}${ext}`;
      
      downloads.push(
        downloadImage(feed.logo, filename)
          .then(() => {
            logoMap[feed.id] = `/src/assets/logos/${filename}`;
          })
          .catch(err => {
            console.error(`❌ Error downloading ${feed.name}: ${err.message}`);
            logoMap[feed.id] = feed.logo; // Keep original URL on error
          })
      );
    }
  }
  
  await Promise.all(downloads);
  
  // Update rss-feeds.json with local paths
  const updatedFeeds = rssFeeds.map(feed => ({
    ...feed,
    logo: logoMap[feed.id] || feed.logo
  }));
  
  fs.writeFileSync(
    path.join(__dirname, 'rss-feeds.json'),
    JSON.stringify(updatedFeeds, null, 2)
  );
  
  console.log('\n✅ All logos downloaded!');
  console.log('✅ Updated rss-feeds.json with local paths');
  console.log(`\n📁 Logos saved to: ${logosDir}`);
}

downloadAllLogos().catch(console.error);
