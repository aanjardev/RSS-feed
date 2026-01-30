<script>
  import { onMount } from 'svelte';
  
  let { articleId, onClose } = $props();
  
  const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:3000';
  
  let article = $state(null);
  let loading = $state(true);
  let error = $state(null);
  
  onMount(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/custom-articles/${articleId}`);
      if (!response.ok) throw new Error('Failed to load article');
      article = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

<!-- Modal Backdrop -->
<div 
  class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
  onclick={handleBackdropClick}
  onkeydown={(e) => e.key === 'Escape' && onClose()}
  role="button"
  tabindex="-1"
  aria-label="Close modal"
>
  <div class="bg-base-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-neutral">
    <!-- Header -->
    <div class="sticky top-0 bg-base-100 border-b-4 border-neutral px-6 py-4 flex justify-between items-center">
      <h2 class="text-xl font-black uppercase tracking-tight">Detail Artikel</h2>
      <button 
        onclick={onClose}
        class="btn btn-sm btn-square btn-ghost border-2 border-neutral hover:bg-error hover:text-error-content"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="px-6 py-6">
      {#if loading}
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {:else if error}
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error: {error}</span>
        </div>
      {:else if article}
        <article class="prose prose-lg max-w-none">
          <!-- Title -->
          <h1 class="text-4xl font-black leading-tight mb-4 border-l-8 border-primary pl-4">
            {article.title}
          </h1>
          
          <!-- Meta Info -->
          <div class="flex flex-wrap gap-4 items-center text-sm mb-6 not-prose">
            <div class="badge badge-primary badge-lg font-semibold">
              {article.source_name || 'papua.news'}
            </div>
            {#if article.category_name}
              <div class="badge badge-secondary badge-lg">
                {article.category_name}
              </div>
            {/if}
            {#if article.author}
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="font-semibold">{article.author}</span>
              </div>
            {/if}
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{new Date(article.pub_date).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <!-- Featured Image -->
          {#if article.image_url}
            <figure class="mb-6">
              <img 
                src={article.image_url} 
                alt={article.title}
                class="w-full rounded-lg border-4 border-neutral shadow-[8px_8px_0_rgba(0,0,0,0.1)]"
              />
            </figure>
          {/if}
          
          <!-- Description -->
          {#if article.description}
            <div class="bg-base-200 border-l-4 border-accent p-4 rounded-r-lg mb-6">
              <p class="text-lg font-semibold italic">{article.description}</p>
            </div>
          {/if}
          
          <!-- Content -->
          {#if article.content}
            <div class="article-content text-base leading-relaxed">
              {@html article.content}
            </div>
          {:else}
            <p class="text-base-content/60 italic">Konten artikel tidak tersedia.</p>
          {/if}
          
          <!-- External Link -->
          {#if article.link}
            <div class="mt-8 pt-6 border-t-2 border-neutral not-prose">
              <a 
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-lg gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Baca Selengkapnya
              </a>
            </div>
          {/if}
        </article>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.article-content p) {
    margin-bottom: 1rem;
    line-height: 1.8;
  }
  
  :global(.article-content h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  :global(.article-content h3) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  :global(.article-content ul, .article-content ol) {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  :global(.article-content li) {
    margin-bottom: 0.5rem;
  }
  
  :global(.article-content blockquote) {
    border-left: 4px solid currentColor;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    opacity: 0.9;
  }
  
  :global(.article-content img) {
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }
  
  :global(.article-content a) {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>
