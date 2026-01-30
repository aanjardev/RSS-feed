<script>
  import { onMount } from 'svelte';
  
  let { slug } = $props();
  
  const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:3000';
  
  let article = $state(null);
  let comments = $state([]);
  let loading = $state(true);
  let commentText = $state('');
  let guestName = $state('');
  let submittingComment = $state(false);
  let showShareMenu = $state(false);
  
  onMount(async () => {
    await loadArticle();
    await loadComments();
  });
  
  async function loadArticle() {
    try {
      const response = await fetch(`${API_BASE}/api/custom-articles/slug/${slug}`);
      if (!response.ok) throw new Error('Article not found');
      article = await response.json();
      
      // Update page meta
      if (article) {
        document.title = `${article.title} - Papua.news`;
        updateMetaTags();
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      loading = false;
    }
  }
  
  async function loadComments() {
    if (!article) return;
    try {
      const response = await fetch(`${API_BASE}/api/comments/${article.id}`);
      if (response.ok) {
        const data = await response.json();
        comments = data.comments || [];
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }
  
  async function handleSubmitComment() {
    if (!commentText.trim()) return;
    
    submittingComment = true;
    try {
      const response = await fetch(`${API_BASE}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: article.id,
          comment_text: commentText,
          guest_name: guestName.trim() || undefined
        })
      });
      
      if (!response.ok) throw new Error('Failed to post comment');
      
      const data = await response.json();
      comments = [data.comment, ...comments];
      commentText = '';
      guestName = '';
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      submittingComment = false;
    }
  }
  
  function updateMetaTags() {
    if (!article) return;
    
    // Update description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = article.description || article.title;
    }
    
    // Update OG tags
    const url = window.location.href;
    updateOrCreateMeta('og:title', article.title);
    updateOrCreateMeta('og:description', article.description || article.title);
    updateOrCreateMeta('og:url', url);
    if (article.image_url) {
      updateOrCreateMeta('og:image', article.image_url);
    }
    updateOrCreateMeta('og:type', 'article');
  }
  
  function updateOrCreateMeta(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }
  
  function shareWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  }
  
  function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }
  
  function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }
  
  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link berhasil disalin!');
    showShareMenu = false;
  }
  
  function goBack() {
    window.history.back();
  }
</script>

<div class="min-h-screen bg-base-100">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-base-100 border-b-4 border-neutral shadow-[var(--shadow-1)]">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <button onclick={goBack} class="btn btn-ghost gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </button>
      
      <a href="/" class="text-2xl font-black">papua.news</a>
      
      <div class="relative">
        <button 
          onclick={() => showShareMenu = !showShareMenu}
          class="btn btn-primary gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
        
        {#if showShareMenu}
          <div class="absolute right-0 mt-2 bg-base-100 border-2 border-neutral rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.1)] p-2 w-48">
            <button onclick={shareWhatsApp} class="btn btn-ghost btn-sm w-full justify-start gap-2">
              <span class="text-green-600">📱</span> WhatsApp
            </button>
            <button onclick={shareFacebook} class="btn btn-ghost btn-sm w-full justify-start gap-2">
              <span class="text-blue-600">📘</span> Facebook
            </button>
            <button onclick={shareTwitter} class="btn btn-ghost btn-sm w-full justify-start gap-2">
              <span class="text-sky-500">🐦</span> Twitter
            </button>
            <button onclick={copyLink} class="btn btn-ghost btn-sm w-full justify-start gap-2">
              <span>🔗</span> Copy Link
            </button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  {#if loading}
    <div class="flex justify-center items-center min-h-[60vh]">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if !article}
    <div class="container mx-auto px-4 py-12 text-center">
      <h1 class="text-4xl font-black mb-4">Artikel Tidak Ditemukan</h1>
      <button onclick={goBack} class="btn btn-primary">Kembali</button>
    </div>
  {:else}
    <!-- Article Content -->
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <article class="bg-base-100 rounded-xl border-4 border-neutral shadow-[8px_8px_0_rgba(0,0,0,0.1)] p-6 md:p-8">
        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-black leading-tight mb-4 border-l-8 border-primary pl-4">
          {article.title}
        </h1>
        
        <!-- Meta Info -->
        <div class="flex flex-wrap gap-4 items-center text-sm mb-6 border-b-2 border-neutral pb-4">
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
            <span>{new Date(article.pub_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        
        <!-- Image -->
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
        <div class="prose prose-lg max-w-none mb-8 article-content">
          {@html article.content}
        </div>
      </article>

      <!-- Comments Section -->
      <div class="mt-8 bg-base-100 rounded-xl border-4 border-neutral shadow-[8px_8px_0_rgba(0,0,0,0.1)] p-6">
        <h2 class="text-2xl font-black mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Komentar ({comments.length})
        </h2>
        
        <!-- Comment Form -->
        <div class="mb-6">
          <div class="form-control mb-3">
            <input
              type="text"
              bind:value={guestName}
              placeholder="Nama kamu (opsional, akan di-generate otomatis)"
              class="input input-bordered w-full"
              maxlength="50"
            />
          </div>
          <div class="form-control mb-3">
            <textarea
              bind:value={commentText}
              placeholder="Tulis komentar kamu..."
              class="textarea textarea-bordered h-24"
              maxlength="1000"
            ></textarea>
          </div>
          <button 
            onclick={handleSubmitComment}
            disabled={!commentText.trim() || submittingComment}
            class="btn btn-primary"
          >
            {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </div>
        
        <!-- Comments List -->
        <div class="space-y-4">
          {#each comments as comment (comment.id)}
            <div class="bg-base-200 rounded-lg p-4 border-2 border-neutral">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{comment.guest_name}</span>
                <span class="text-xs opacity-60">
                  {new Date(comment.created_at).toLocaleString('id-ID')}
                </span>
              </div>
              <p class="whitespace-pre-wrap">{comment.comment_text}</p>
            </div>
          {:else}
            <p class="text-center text-base-content/60 py-8">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          {/each}
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-base-200 border-t-4 border-neutral mt-12">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Brand -->
          <div>
            <h3 class="text-xl font-black mb-2">papua.news</h3>
            <p class="text-sm opacity-80">
              Portal berita terkini Papua dan Indonesia Timur
            </p>
          </div>
          
          <!-- Links -->
          <div class="text-sm">
            <div class="flex flex-wrap gap-4">
              <a href="/" class="hover:text-primary transition-colors">🏠 Beranda</a>
              <a href="/about" class="hover:text-primary transition-colors">ℹ️ Tentang</a>
              <a href="mailto:info@papua.news" class="hover:text-primary transition-colors">✉️ Kontak</a>
            </div>
            <p class="text-xs opacity-60 mt-4">
              © 2026 papua.news - 🏔️ Tanah Papua, Tanah Cinta
            </p>
          </div>
        </div>
      </div>
    </footer>
  {/if}
</div>

<style>
  :global(.article-content p) {
    margin-bottom: 1rem;
    line-height: 1.8;
  }
  
  :global(.article-content h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
  }
  
  :global(.article-content h3) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.5rem;
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
