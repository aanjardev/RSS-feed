import Parser from 'rss-parser';
import { Source } from '../models/Source.js';
import { Article } from '../models/Article.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['enclosure', 'enclosure'],
      ['description', 'description'],
      ['content:encoded', 'contentEncoded']
    ]
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 10000
});

function extractImageUrl(item) {
  // Try different possible image sources
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  if (item.media && item.media.$ && item.media.$.url) {
    return item.media.$.url;
  }
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  
  // Try to extract from content
  const content = item.contentEncoded || item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) {
    return imgMatch[1];
  }
  
  return null;
}

async function fetchRSSFeed(source) {
  try {
    console.log(`📰 Fetching RSS from ${source.name}...`);
    const feed = await parser.parseURL(source.url);
    
    let newArticles = 0;
    
    for (const item of feed.items) {
      const article = {
        source_id: source.id,
        title: item.title || 'No Title',
        link: item.link || item.guid,
        description: item.contentSnippet || item.description || '',
        pub_date: item.pubDate ? new Date(item.pubDate) : new Date(),
        content: item.contentEncoded || item.content || item.description || '',
        image_url: extractImageUrl(item),
        author: item.creator || item.author || null
      };
      
      const created = await Article.create(article);
      if (created) {
        newArticles++;
      }
    }
    
    console.log(`✅ ${source.name}: ${newArticles} new articles added`);
    return newArticles;
  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error.message);
    return 0;
  }
}

export async function startRSSFetcher() {
  try {
    const sources = await Source.getAll();
    console.log(`🔍 Found ${sources.length} active RSS sources`);
    
    let totalNew = 0;
    for (const source of sources) {
      const newCount = await fetchRSSFeed(source);
      totalNew += newCount;
    }
    
    console.log(`🎉 RSS fetch completed: ${totalNew} new articles total`);
    
    // Clean up old articles (older than 30 days)
    const deleted = await Article.deleteOld(30);
    if (deleted > 0) {
      console.log(`🧹 Cleaned up ${deleted} old articles`);
    }
  } catch (error) {
    console.error('❌ RSS fetcher error:', error);
  }
}
