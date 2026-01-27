<script>
  import { onMount } from 'svelte';
  
  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  let { sourceId, sourceName } = $props();
  
  let articles = $state([]);
  let isLoading = $state(true);
  let pagination = $state({ page: 1, limit: 50, total: 0, totalPages: 0 });
  let selectedArticles = $state([]);
  
  async function loadArticles() {
    try {
      const res = await fetch(
        `${API_BASE}/api/article-management/by-source/${sourceId}?page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = await res.json();
      
      if (data.success) {
        articles = data.articles;
        pagination = data.pagination;
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/article-management/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await loadArticles();
      }
    } catch (error) {
      alert('Error deleting article: ' + error.message);
    }
  }
  
  async function deleteSelected() {
    if (selectedArticles.length === 0) {
      alert('No articles selected');
      return;
    }
    
    if (!confirm(`Delete ${selectedArticles.length} articles?`)) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/article-management/delete-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedArticles })
      });
      
      const data = await res.json();
      
      if (data.success) {
        selectedArticles = [];
        await loadArticles();
        alert(data.message);
      }
    } catch (error) {
      alert('Error deleting articles: ' + error.message);
    }
  }
  
  function toggleSelectAll() {
    if (selectedArticles.length === articles.length) {
      selectedArticles = [];
    } else {
      selectedArticles = articles.map(a => a.id);
    }
  }
  
  function toggleSelect(id) {
    if (selectedArticles.includes(id)) {
      selectedArticles = selectedArticles.filter(i => i !== id);
    } else {
      selectedArticles = [...selectedArticles, id];
    }
  }
  
  onMount(() => {
    loadArticles();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-6">
      <a 
        href="/admin" 
        class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors mb-4"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Admin
      </a>
      
      <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Articles from {sourceName}
      </h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {pagination.total} total articles
      </p>
    </div>
    
    <!-- Bulk Actions -->
    {#if selectedArticles.length > 0}
      <div class="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {selectedArticles.length} selected
          </span>
          <button
            onclick={deleteSelected}
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Articles Table -->
    {#if isLoading}
      <div class="flex justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
      </div>
    {:else}
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead class="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th class="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onchange={toggleSelectAll}
                    class="h-4 w-4 rounded border-slate-300"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Image
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Published
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              {#each articles as article}
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onchange={() => toggleSelect(article.id)}
                      class="h-4 w-4 rounded border-slate-300"
                    />
                  </td>
                  <td class="px-6 py-4">
                    {#if article.image_url}
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        class="h-16 w-24 rounded-lg object-cover"
                        onerror={(e) => e.target.style.display = 'none'}
                      />
                    {:else}
                      <div class="h-16 w-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    {/if}
                  </td>
                  <td class="px-6 py-4">
                    <a href={article.link} target="_blank" class="text-sm font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100">
                      {article.title}
                    </a>
                    {#if article.description}
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {article.description}
                      </p>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(article.pub_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onclick={() => deleteArticle(article.id)}
                      aria-label="Delete article"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        {#if pagination.totalPages > 1}
          <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div class="flex items-center justify-between">
              <button
                onclick={() => { pagination.page--; loadArticles(); }}
                disabled={pagination.page === 1}
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onclick={() => { pagination.page++; loadArticles(); }}
                disabled={pagination.page === pagination.totalPages}
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
