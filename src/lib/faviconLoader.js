// Dynamic favicon loader - fetches from database settings
export async function loadFavicon() {
  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  try {
    const response = await fetch(`${API_BASE}/api/settings/favicon_url`);
    if (response.ok) {
      const data = await response.json();
      const faviconUrl = data.value;
      
      if (faviconUrl) {
        // Update all favicon link tags
        const links = document.querySelectorAll('link[rel*="icon"]');
        links.forEach(link => {
          link.href = faviconUrl;
        });
        
        // If no favicon link exists, create one
        if (links.length === 0) {
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/x-icon';
          link.href = faviconUrl;
          document.head.appendChild(link);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load favicon from settings:', error);
  }
}

// Load site title from settings
export async function loadSiteTitle() {
  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  try {
    const response = await fetch(`${API_BASE}/api/settings/site_name`);
    if (response.ok) {
      const data = await response.json();
      if (data.value) {
        document.title = data.value;
      }
    }
  } catch (error) {
    console.error('Failed to load site title:', error);
  }
}

// Load both favicon and site title
export async function loadSiteMetadata() {
  await Promise.all([
    loadFavicon(),
    loadSiteTitle()
  ]);
}
