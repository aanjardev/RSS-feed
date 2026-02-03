// Auto-detect environment
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || window.location.origin)
  : 'http://localhost:4000';

// Cache settings to avoid multiple requests
let cachedSettings = null;

// Fetch settings from API
async function fetchSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings/public`);
    if (response.ok) {
      cachedSettings = await response.json();
      console.log('⚙️ Settings fetched in api.js:', cachedSettings);
      return cachedSettings;
    }
  } catch (error) {
    console.error('Error fetching settings in api.js:', error);
  }
  return null;
}
 
// Fetch articles from backend API (not direct RSS)
export async function fetchArticlesBySource(sourceId, limit = null, offset = 0) {
  // If limit not provided, get from settings
  if (limit === null || limit === undefined) {
    const settings = await fetchSettings();
    limit = settings?.articles_per_source || 5;
    console.log('📊 Using articles_per_source from settings:', limit);
  }
  
  console.log('🌐 fetchArticlesBySource called:', { sourceId, limit, offset });
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?source_id=${sourceId}&limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

// Fetch all sources with article counts
export async function fetchAllSources() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/sources`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
}

// Legacy function for backward compatibility (deprecated)
export async function loadMoreArticles(url, skip = 0) {
  try {
    const response = await fetch(`${API_BASE_URL}/load-more`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, skip }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading articles:', error);
    throw error;
  }
}

export const rssSources = [
  {
    id: 1,
    name: "Tempo Bisnis",
    sub: "Tempo.co Berita Bisnis Terkini Indonesia dan Dunia RSS",
    url: "https://rss.tempo.co/bisnis",
    logo: "http://www.tilikfeed.com/logos/icons/tempo.png",
    category: "Business"
  },
  {
    id: 2,
    name: "Liputan 6",
    sub: "Liputan6.com Politik",
    url: "https://feed.liputan6.com/rss/news",
    logo: "http://www.tilikfeed.com/logos/icons/liputan6.jpeg",
    category: "News"
  },
  {
    id: 3,
    name: "Tribunnews",
    sub: "Tribunnews.com",
    url: "https://www.tribunnews.com/rss",
    logo: "http://www.tilikfeed.com/logos/icons/tribunnews.png",
    category: "News"
  },
  {
    id: 4,
    name: "CNBC Market",
    sub: "Market - Berita Terkini Market, Saham, Reksadana",
    url: "https://www.cnbcindonesia.com/market/rss/",
    logo: "http://www.tilikfeed.com/logos/icons/CNBC_Indonesia.png",
    category: "Business"
  },
  {
    id: 5,
    name: "Tempo Nasional",
    sub: "Tempo.co Berita Nasional Terbaru Indonesia",
    url: "https://rss.tempo.co/nasional",
    logo: "http://www.tilikfeed.com/logos/icons/tempo.png",
    category: "News"
  },
  {
    id: 6,
    name: "Republika",
    sub: "Republika Online RSS Feed",
    url: "https://www.republika.co.id/rss",
    logo: "http://www.tilikfeed.com/logos/icons/republika.png",
    category: "News"
  },
];

