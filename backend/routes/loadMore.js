import express from 'express';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['enclosure', 'enclosure'],
      ['description', 'description'],
      ['content:encoded', 'contentEncoded']
    ]
  }
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

// POST /load-more
router.post('/', async (req, res) => {
  try {
    const { url, skip = 0 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'RSS feed URL is required' });
    }
    
    console.log(`📰 Loading more from: ${url}, skip: ${skip}`);
    
    // Parse RSS feed
    const feed = await parser.parseURL(url);
    
    // Get items with pagination
    const itemsPerPage = 11;
    const startIndex = parseInt(skip) || 0;
    const endIndex = startIndex + itemsPerPage;
    
    const paginatedItems = feed.items.slice(startIndex, endIndex);
    const hasMore = endIndex < feed.items.length;
    
    // Format response
    const items = paginatedItems.map(item => ({
      title: item.title || 'No Title',
      link: item.link || item.guid || '#',
      description: item.contentSnippet || item.description || '',
      pubDate: item.pubDate || new Date().toISOString(),
      image: extractImageUrl(item)
    }));
    
    res.json({
      items,
      hasMore
    });
    
  } catch (error) {
    console.error('❌ Load more error:', error.message);
    res.status(500).json({ 
      error: 'Failed to load RSS feed',
      message: error.message 
    });
  }
});

export default router;
