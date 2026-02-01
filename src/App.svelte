<script>
  import { onMount } from "svelte";
  import fallbackLogo from "./assets/logo-fallback.svg";
  import { fetchArticlesBySource, fetchAllSources } from "./api";
  import ArticleDetail from "./ArticleDetail.svelte";
  import { navigateTo } from "./main.jsx";

  let isSidebarOpen = $state(false);
  let searchQuery = $state("");
  let visibleCount = $state({});
  let currentSlide = $state(0);
  let sliderColors = $state([]);
  let showArticleDetail = $state(false);
  let selectedArticleId = $state(null);
  let cardColors = $state([]);
  let featuredNews = $state([]);
  let newsSources = $state([]);
  let isLoading = $state(true);
  let loadingMore = $state({});
  let settings = $state({});

  // Helper function to convert relative image URL to absolute URL
  function getImageUrl(imageUrl) {
    if (!imageUrl) return null;
    
    // If already absolute URL (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If relative URL (starts with /), prepend API base URL
    const API_BASE = import.meta.env.PROD
      ? (import.meta.env.VITE_API_URL || window.location.origin)
      : 'http://localhost:3000';
    
    return `${API_BASE}${imageUrl}`;
  }

  // Load public settings
  async function loadSettings() {
    try {
      const API_BASE = import.meta.env.PROD
        ? (import.meta.env.VITE_API_URL || window.location.origin)
        : 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE}/api/settings/public`);
      if (response.ok) {
        settings = await response.json();
        
        // Apply settings
        if (settings.site_name) {
          document.title = settings.site_name;
        }
        
        if (settings.favicon_url) {
          // Update favicon
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = settings.favicon_url;
        }
        
        if (settings.primary_color) {
          // Update primary color CSS variable
          document.documentElement.style.setProperty('--primary-color', settings.primary_color);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  // Fungsi untuk shuffle array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Load theme colors from API
  async function loadThemeColors() {
    try {
      const API_BASE = import.meta.env.PROD
        ? (import.meta.env.VITE_API_URL || window.location.origin)
        : 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE}/api/theme`);
      if (response.ok) {
        const data = await response.json();
        return {
          sliderColors: data.slider_colors || allSliderColors,
          cardColors: data.card_colors || allCardColors
        };
      }
    } catch (error) {
      console.error('Error loading theme colors:', error);
    }
    return null;
  }

  // All colors (defaults)
  const allSliderColors = [
    "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500",
    "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
    "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500",
    "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500",
    "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500",
    "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500",
    "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500",
    "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
    "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
    "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500",
    "bg-gradient-to-br from-fuchsia-400 via-purple-400 to-violet-500",
    "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500",
  ];

  const allCardColors = [
    "bg-pink-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-indigo-100",
    "bg-rose-100",
    "bg-lime-100",
    "bg-cyan-100",
    "bg-amber-100",
    "bg-emerald-100",
    "bg-sky-100",
    "bg-violet-100",
    "bg-fuchsia-100",
    "bg-red-100",
    "bg-slate-100",
    "bg-stone-100",
    "bg-zinc-100",
  ];

  // Body background colors (subtle patterns)
  const allBodyBackgrounds = [
    "bg-gradient-to-br from-pink-200 via-purple-100 to-purple-200",
    "bg-gradient-to-br from-yellow-200 via-orange-100 to-orange-200",
    "bg-gradient-to-br from-green-200 via-emerald-100 to-emerald-200",
    "bg-gradient-to-br from-blue-200 via-cyan-100 to-cyan-200",
    "bg-gradient-to-br from-purple-200 via-fuchsia-100 to-fuchsia-200",
    "bg-gradient-to-br from-orange-200 via-amber-100 to-amber-200",
    "bg-gradient-to-br from-teal-200 via-cyan-100 to-cyan-200",
    "bg-gradient-to-br from-indigo-200 via-blue-100 to-blue-200",
    "bg-gradient-to-br from-rose-200 via-pink-100 to-pink-200",
    "bg-gradient-to-br from-lime-200 via-green-100 to-green-200",
  ];

  // Initialize colors on mount
  onMount(async () => {
    await loadSettings();
    
    // Load theme colors from API
    const themeData = await loadThemeColors();
    if (themeData) {
      sliderColors = shuffleArray(themeData.sliderColors);
      cardColors = shuffleArray(themeData.cardColors);
    } else {
      sliderColors = shuffleArray(allSliderColors);
      cardColors = shuffleArray(allCardColors);
    }
    
    await loadInitialArticles();
  });
  let bodyBgColor = $state(allBodyBackgrounds[Math.floor(Math.random() * allBodyBackgrounds.length)]);
  $effect(() => {
    bodyBgColor = allBodyBackgrounds[Math.floor(Math.random() * allBodyBackgrounds.length)];
  });

  // Load initial articles from backend API
  async function loadInitialArticles() {
    isLoading = true;
    try {
      // Fetch all sources first
      const sourcesData = await fetchAllSources();
      
      // Then fetch articles for each source
      const articlesPerSource = settings.articles_per_source || 10;
      const results = await Promise.all(
        sourcesData.sources.map(async (source) => {
          const data = await fetchArticlesBySource(source.id, articlesPerSource);
          return {
            id: source.id,
            name: source.name,
            sub: source.description,
            logo: source.logo,
            url: source.url,
            category: source.category,
            is_custom: source.is_custom || false,
            news: data.articles.map((article) => ({
              id: article.id,
              title: article.title,
              desc: article.description || '',
              image: getImageUrl(article.image_url),
              link: article.link,
              slug: article.slug,
              is_custom: article.is_custom || false,
              time: new Date(article.pub_date).toLocaleString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              pubDate: article.pub_date
            })),
            hasMore: data.count >= articlesPerSource,
            skip: articlesPerSource,
          };
        })
      );
      newsSources = results.filter(source => source.news.length > 0);
      
      // Separate papua.news and randomize others
      const papuaNewsSource = newsSources.find(s => 
        s.is_custom || s.name.toLowerCase().includes('papua.news') || s.name.includes('Editorial')
      );
      const otherSources = newsSources.filter(s => 
        !(s.is_custom || s.name.toLowerCase().includes('papua.news') || s.name.includes('Editorial'))
      );
      
      // Randomize other sources
      const randomizedSources = shuffleArray(otherSources);
      
      // Reconstruct: papua.news first, then randomized sources
      newsSources = papuaNewsSource ? [papuaNewsSource, ...randomizedSources] : randomizedSources;
      
      // Initialize visible count and loading state for each source
      newsSources.forEach((source) => {
        visibleCount[source.id] = articlesPerSource;
        loadingMore[source.id] = false;
      });
      
      // Prepare featured news - ONLY from custom articles (papua.news/Editorial) with images
      featuredNews = results
        .filter((source) => source.is_custom || source.name === 'papua.news' || source.name === 'Papua.News' || source.name.includes('Editorial'))
        .flatMap((source) =>
          source.news.map((news) => ({
            ...news,
            sourceName: source.name,
            sourceLogo: source.logo || fallbackLogo,
          }))
        )
        .filter((news) => news.image && news.image !== null && news.image !== '') // Only articles with images
        .slice(0, settings.items_per_page || 10) // Limit based on settings
        .map((news, idx) => ({
          ...news,
          bgColor: sliderColors[idx % sliderColors.length],
        }));
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      isLoading = false;
    }
  }

  // Load more articles for specific source
  async function handleShowMore(sourceId) {
    const source = newsSources.find(s => s.id === sourceId);
    if (!source || !source.hasMore || loadingMore[sourceId]) return;
    
    const articlesPerSource = settings.articles_per_source || 10;
    loadingMore[sourceId] = true;
    try {
      const data = await fetchArticlesBySource(sourceId, articlesPerSource, source.skip);
      
      const newArticles = data.articles.map((article) => ({
        id: article.id,
        title: article.title,
        desc: article.description || '',
        image: getImageUrl(article.image_url),
        link: article.link,
        slug: article.slug,
        is_custom: article.is_custom || false,
        time: new Date(article.pub_date).toLocaleString('id-ID', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        pubDate: article.pub_date
      }));
      
      newsSources = newsSources.map(s => {
        if (s.id === sourceId) {
          return {
            ...s,
            news: [...s.news, ...newArticles],
            hasMore: data.count >= articlesPerSource,
            skip: s.skip + data.count,
          };
        }
        return s;
      });
      
      visibleCount = { ...visibleCount, [sourceId]: visibleCount[sourceId] + articlesPerSource };
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      loadingMore[sourceId] = false;
    }
  }

  // Handle article click
  function handleArticleClick(e, article, source) {
    // Check if it's a custom article from papua.news
    if (source.is_custom || source.name === 'papua.news' || source.name === 'Editorial' || source.name === 'Editorial Team') {
      e.preventDefault();
      if (article.slug) {
        window.location.href = `/artikel/${article.slug}`;
      } else {
        // Fallback to modal if no slug
        selectedArticleId = article.id;
        showArticleDetail = true;
      }
    }
    // Otherwise, let the default <a> behavior open external link
  }

  function closeArticleDetail() {
    showArticleDetail = false;
    selectedArticleId = null;
  }

  // Scroll to source card when clicked in sidebar
  function scrollToSource(sourceId) {
    const element = document.getElementById(`source-${sourceId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      // Close mobile sidebar after clicking
      if (window.innerWidth < 768) {
        isSidebarOpen = false;
      }
    }
  }

  // Prepare featured news
  featuredNews = [];

  // Handle image load error
  function handleImageError(event) {
    event.target.style.display = 'none';
  }

  // Handle slider image error with gradient background fallback
  function handleSliderImageError(event, bgColor) {
    event.target.style.display = 'none';
    // Show the gradient background instead
    const parent = event.target.parentElement;
    if (parent) {
      parent.classList.add(bgColor);
    }
  }

  // Auto-slide
  onMount(() => {
    loadSettings();
    loadInitialArticles();
    
    const timer = setInterval(() => {
      if (featuredNews.length > 0) {
        currentSlide = (currentSlide + 1) % featuredNews.length;
      }
    }, 5000);
    return () => clearInterval(timer);
  });

  function nextSlide() {
    currentSlide = (currentSlide + 1) % featuredNews.length;
  }

  function prevSlide() {
    currentSlide =
      (currentSlide - 1 + featuredNews.length) % featuredNews.length;
  }

  let filteredSources = $derived(newsSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  ));
  
  // Display sources: papua.news first, randomized middle, About card last
  let displaySources = $derived([
    ...newsSources,
    {
      id: 'about-card',
      name: 'Tentang Kami',
      sub: 'Informasi tentang Papua.News',
      logo: settings.logo_url || fallbackLogo,
      isAboutCard: true,
      news: []
    }
  ]);
</script>

<div class="min-h-screen {bodyBgColor} text-neutral overflow-hidden flex flex-col">
  <!-- NAVBAR -->
  <nav
    class="navbar px-6 border-b-2 border-black/15 shadow-[0_2px_8px_rgba(0,0,0,0.08)] fixed top-0 left-0 right-0 z-50 {bodyBgColor}"
  >
    <div class="navbar-start flex items-center gap-3">
      {#if settings.logo_url}
        <img 
          src={settings.logo_url} 
          alt="Logo" 
          style="height: {settings.logo_height || 48}px; width: {settings.logo_width || 'auto'};"
          class="object-contain"
          onerror={(e) => e.target.style.display = 'none'}
        />
      {:else}
        <div
          class="btn btn-square btn-primary border-2 border-black/20 shadow-[2px_2px_0_rgba(0,0,0,0.12)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
        </div>
      {/if}
      <!-- <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em]">{settings.site_name || 'Tilik'}</p>
        <h1 class="text-2xl font-black leading-tight tracking-tight">{settings.site_tagline || 'Feed'}</h1>
      </div> -->
    </div>

    <div class="navbar-end gap-2">
      
      <button
        onclick={() => (isSidebarOpen = !isSidebarOpen)}
        class="btn btn-square btn-ghost border-2 border-neutral neo-hover"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
    </div>
  </nav>

  <div class="flex flex-1 relative overflow-hidden pt-20">
    <!-- MAIN FEED -->
    <main
      class="overflow-y-auto px-4 md:px-8 lg:px-12 xl:px-16 py-8 flex-1 md:flex-none {isSidebarOpen
        ? 'md:w-[calc(100%-280px)]'
        : 'md:w-full'}"
    >
      <!-- Loading State -->
      {#if isLoading}
        <div class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="mt-4 text-lg font-semibold">Loading articles...</p>
          </div>
        </div>
      {:else}
        <!-- SLIDER / CAROUSEL -->
        <div class="mx-auto w-full max-w-[1280px] mb-8">
          <div
            class="relative rounded-2xl border-2 border-black/15 overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.1)] bg-base-200"
          >
            <!-- Slides -->
            <div class="relative h-[300px] md:h-[400px]">
              {#each featuredNews as news, idx}
                <div
                  class="absolute inset-0 transition-opacity duration-700 {idx ===
                  currentSlide
                    ? 'opacity-100'
                    : 'opacity-0'}"
                >
                  <div class="relative w-full h-full">
                    <!-- Background Image -->
                    <img
                      src={news.image}
                      alt="{news.title}"
                      loading="{idx === 0 ? 'eager' : 'lazy'}"
                      fetchpriority="{idx === 0 ? 'high' : 'auto'}"
                      width="1280"
                      height="400"
                      class="absolute inset-0 w-full h-full object-cover"
                      onerror={(e) => handleSliderImageError(e, news.bgColor)}
                    />

                    <!-- Dark Gradient for Text -->
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    ></div>

                    <!-- Content -->
                    <div
                      class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
                    >
                      <div class="flex items-center gap-2 mb-3">
                        <img
                          src={news.sourceLogo}
                          alt="{news.sourceName} logo"
                          width="32"
                          height="32"
                          class="w-8 h-8 rounded-full border-2 border-white bg-white"
                          onerror={(e) => { e.target.src = fallbackLogo; }}
                        />
                        <span
                          class="text-xs font-bold uppercase tracking-wide"
                        >
                          {news.sourceName}
                        </span>
                        <span class="text-xs opacity-70">• {news.time}</span>
                      </div>
                      <h2
                        class="text-2xl md:text-3xl font-black leading-tight mb-2 drop-shadow-lg"
                      >
                        {news.title}
                      </h2>
                      <p
                        class="text-sm md:text-base opacity-90 line-clamp-2 max-w-3xl mb-4"
                      >
                        {news.desc}
                      </p>
                      <button
                        onclick={() => {
                          if (news.slug) {
                            window.location.href = `/artikel/${news.slug}`;
                          } else if (news.link) {
                            window.open(news.link, '_blank');
                          }
                        }}
                        class="btn btn-primary btn-sm border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <!-- Navigation Buttons -->
          <button
            onclick={prevSlide}
            class="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-primary border-2 border-neutral shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] z-10"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onclick={nextSlide}
            class="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-primary border-2 border-neutral shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] z-10"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <!-- Indicators -->
          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          >
            {#each featuredNews as _, idx}
              <button
                onclick={() => (currentSlide = idx)}
                class="h-2 rounded-full border border-neutral transition-all {idx ===
                currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-white/50 hover:bg-white/80'}"
                aria-label="Go to slide {idx + 1}"
              ></button>
            {/each}
          </div>
        </div>
      </div>

      <div
        class="mx-auto w-full max-w-[1280px] grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
      >
        {#each displaySources as source, sourceIdx}
          {@const shown = visibleCount[source.id] ?? 11}
          {@const logoUrl = source.logo || fallbackLogo}
          
          {#if source.isAboutCard}
          <!-- About Card -->
          <div
            id="source-about"
            class="card card-bordered border-2 border-black/15 bg-gradient-to-br from-primary/10 via-primary/5 to-base-200 h-full min-h-0 shadow-[2px_2px_0_rgba(0,0,0,0.08)]"
          >
            <div class="px-3 py-3 sticky top-0 bg-primary/10 border-b border-black/15">
              <div class="flex items-center gap-2">
                <img
                  src={logoUrl}
                  alt="Tentang Kami"
                  width="48"
                  height="48"
                  class="w-12 h-12 object-cover"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <h2 class="card-title leading-tight text-base font-black">
                    Tentang Kami
                  </h2>
                  <p class="text-xs opacity-70 truncate mt-1">Papua.News</p>
                </div>
              </div>
            </div>
            
            <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mb-6 text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              
              <h3 class="text-xl font-bold mb-3">Tentang Papua.News</h3>
              <p class="text-sm opacity-80 leading-relaxed mb-6">
                Portal berita agregator yang menyajikan informasi terkini dari berbagai sumber berita terpercaya di Papua.
              </p>
              
              <button
                onclick={() => navigateTo('/about')}
                class="btn btn-primary gap-2 shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
                Selengkapnya
              </button>
            </div>
          </div>
          {:else}
          <!-- Regular Source Card -->
          <div
            id="source-{source.id}"
            class="card card-bordered border-2 border-black/15 bg-base-200 h-full min-h-0 shadow-[2px_2px_0_rgba(0,0,0,0.08)]"
          >
            <!-- Header -->
            <div
              class="px-3 py-3 sticky top-0 bg-base-200 border-b border-black/15"
            >
              <div class="flex items-center gap-2">
                <img
                  src={logoUrl}
                  alt="{source.name} logo"
                  width="48"
                  height="48"
                  class="w-12 h-12 object-cover"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <h2 class="card-title leading-tight text-base">
                    {source.name}
                  </h2>
                  <p class="text-xs opacity-70 truncate mt-1">{source.sub}</p>
                </div>
              </div>
            </div>

            <!-- List Berita -->
            <div class="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-base-200">
              {#each source.news.slice(0, shown || settings.articles_per_source || 10) as item, idx}
                <a
                  href={item.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onclick={(e) => handleArticleClick(e, item, source)}
                  class="group card card-compact border border-black/15 shadow-[1px_1px_0_rgba(0,0,0,0.08)] neo-hover {cardColors[
                    (idx + sourceIdx) % cardColors.length
                  ]} block no-underline hover:border-black/25 hover:shadow-[2px_2px_0_rgba(0,0,0,0.12)]"
                >
                  <div class="card-body gap-3 px-3 py-3">
                    <h3 class="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {#if item.image}
                      <figure
                        class="rounded-lg overflow-hidden border border-neutral shadow-inner"
                      >
                        <img
                          src={item.image}
                          alt="{item.title}"
                          loading="lazy"
                          width="640"
                          height="360"
                          class="w-full aspect-video object-cover"
                          onerror={handleImageError}
                        />
                      </figure>
                    {/if}

                    <p class="text-sm leading-snug opacity-80 line-clamp-2">
                      {item.desc}
                    </p>

                    <div
                      class="flex justify-between items-center text-xs font-semibold"
                    >
                      <span class="uppercase tracking-tight opacity-70">
                        {item.time}
                      </span>
                      <span
                        class="opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all"
                      >
                        Read →
                      </span>
                    </div>
                  </div>
                </a>
              {/each}
            </div>

            <div class="p-4 bg-base-200 border-t-2 border-neutral">
              {#if loadingMore[source.id]}
                <button
                  class="btn btn-primary btn-block border-2 border-neutral shadow-[var(--shadow-1)]"
                  disabled
                >
                  <span class="loading loading-spinner"></span>
                  Loading...
                </button>
              {:else if source.hasMore}
                <button
                  class="btn btn-primary btn-block border-2 border-neutral shadow-[var(--shadow-1)] neo-hover"
                  onclick={() => handleShowMore(source.id)}
                >
                  Load More
                </button>
              {:else}
                <button
                  class="btn btn-primary btn-block border-2 border-neutral shadow-[var(--shadow-1)]"
                  disabled
                >
                  All Caught Up
                </button>
              {/if}
            </div>
          </div>
          {/if}
        {/each}
      </div>
      {/if}
    </main>

    <!-- Desktop sidebar -->
    <aside
      class="{isSidebarOpen
        ? 'hidden md:flex'
        : 'hidden'} fixed top-16 right-0 min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] w-[280px] bg-base-100 border-l-4 border-neutral shadow-[var(--shadow-1)] overflow-hidden"
    >
      <div class="py-6 px-4 flex flex-col h-full w-full gap-4">
        <div
          class="flex justify-between items-center border-b-4 border-neutral pb-3"
        >
          <span class="font-black tracking-tight uppercase text-sm">
            RSS Feed Sources
          </span>
        </div>

        <label
          class="input input-bordered input-lg flex items-center gap-2 shadow-[var(--shadow-1)] bg-base-200 border-2 border-neutral"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            class="grow text-sm placeholder:text-xs"
            placeholder="Cari sumber berita..."
            bind:value={searchQuery}
          />
        </label>

        <ul
          class="menu flex flex-col flex-nowrap flex-1 gap-1 w-full pr-1 max-h-[calc(100vh-320px)] overflow-y-auto"
        >
          {#each filteredSources as source (source.id)}
            <li>
              <button                onclick={() => scrollToSource(source.id)}                class="w-full justify-start gap-3 font-semibold px-3 py-2 rounded-lg hover:bg-base-200 hover:border hover:border-neutral hover:shadow-[4px_4px_0_#111]"
              >
                <img
                  src={source.logo || fallbackLogo}
                  alt={source.name}
                  class="w-6 h-6 rounded-md object-cover flex-shrink-0"
                  onerror={(e) => { e.target.src = fallbackLogo; }}
                />
                <span class="flex-1 text-left">{source.name}</span>
                <span
                  class="text-xs font-black tracking-tight opacity-60 group-hover:opacity-100"
                >
                  ›
                </span>
              </button>
            </li>
          {:else}
            <li class="text-center text-sm italic text-neutral/60">
              Sumber "{searchQuery}" tidak ditemukan
            </li>
          {/each}
        </ul>

        <!-- About Link -->
        <button
          onclick={() => navigateTo('/about')}
          class="btn btn-primary gap-2 shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Tentang Kami
        </button>
      </div>
    </aside>

    <!-- Mobile drawer -->
    <aside
      class="md:hidden fixed top-0 right-0 h-full w-[260px] bg-base-100 shadow-[var(--shadow-1)] z-[60] transform transition-transform duration-300 ease-in-out border-l-4 border-neutral {isSidebarOpen
        ? 'translate-x-0'
        : 'translate-x-full'}"
    >
      <div class="py-6 px-4 flex flex-col h-full w-full gap-4">
        <div
          class="flex justify-between items-center border-b-4 border-neutral pb-3"
        >
          <span class="font-black tracking-tight uppercase text-sm">
            RSS Feed Sources
          </span>
          <button
            onclick={() => (isSidebarOpen = false)}
            class="btn btn-sm btn-square btn-ghost border-2 border-neutral neo-hover"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <label
          class="input input-bordered input-lg flex items-center gap-2 shadow-[var(--shadow-1)] bg-base-200 border-2 border-neutral"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            class="grow text-sm placeholder:text-xs"
            placeholder="Cari sumber berita..."
            bind:value={searchQuery}
          />
        </label>

        <ul
          class="menu flex flex-col flex-nowrap flex-1 gap-1 w-full pr-1 max-h-[calc(100vh-320px)] overflow-y-auto"
        >
          {#each filteredSources as source (source.id)}
            <li>
              <button
                onclick={() => scrollToSource(source.id)}
                class="w-full justify-start gap-3 font-semibold px-3 py-2 rounded-lg hover:bg-base-200 hover:border hover:border-neutral hover:shadow-[4px_4px_0_#111]"
              >
                <img
                  src={source.logo || fallbackLogo}
                  alt={source.name}
                  class="w-6 h-6 rounded-md object-cover flex-shrink-0"
                  onerror={(e) => { e.target.src = fallbackLogo; }}
                />
                <span class="flex-1 text-left">{source.name}</span>
                <span
                  class="text-xs font-black tracking-tight opacity-60 group-hover:opacity-100"
                >
                  ›
                </span>
              </button>
            </li>
          {:else}
            <li class="text-center text-sm italic text-neutral/60">
              Sumber "{searchQuery}" tidak ditemukan
            </li>
          {/each}
        </ul>

        <!-- About Link -->
        <button
          onclick={() => navigateTo('/about')}
          class="btn btn-primary gap-2 shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Tentang Kami
        </button>
      </div>
    </aside>

    {#if isSidebarOpen}
      <div
        class="md:hidden fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[55]"
        onclick={() => (isSidebarOpen = false)}
        onkeydown={(e) => e.key === "Escape" && (isSidebarOpen = false)}
        role="button"
        tabindex="0"
      ></div>
    {/if}
    
    <!-- Article Detail Modal -->
    {#if showArticleDetail && selectedArticleId}
      <ArticleDetail 
        articleId={selectedArticleId}
        onClose={closeArticleDetail}
      />
    {/if}
  </div>

  <!-- Footer -->
  <footer class="bg-base-200 border-t-2 border-neutral py-4">
    <div class="container mx-auto px-4 text-right">
      <p class="text-sm opacity-80">
        {settings.footer_text || '© 2026 papua.news - Portal RSS Feed Berita Papua'}
      </p>
      <div class="mt-2">
        <button onclick={() => navigateTo('/terms')} class="text-sm text-primary hover:underline">
          Syarat & Ketentuan
        </button>
        {#if settings.contact_email}
        <span class="mx-2 opacity-50">•</span>
        <a href="mailto:{settings.contact_email}" class="text-sm text-primary hover:underline">
          Kontak
        </a>
        {/if}
      </div>
    </div>
  </footer>
</div>
