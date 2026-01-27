const API_BASE_URL = 'http://localhost:4000';

// Fetch articles from backend API (not direct RSS)
export async function fetchArticlesBySource(sourceId, limit = 10, offset = 0) {
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

