<script>
  import { onMount } from 'svelte';
  import { Dialog } from 'bits-ui';
  import { cn } from './lib/utils';
  
  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  let sources = $state([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let editingSource = $state(null);
  let testingUrl = $state(false);
  let testResult = $state(null);
  
  let formData = $state({
    name: '',
    url: '',
    logo: '',
    description: '',
    category: 'News',
    is_active: true
  });
  
  async function loadSources() {
    try {
      const res = await fetch(`${API_BASE}/api/admin`);
      const data = await res.json();
      if (data.success) {
        sources = data.sources;
      }
    } catch (error) {
      console.error('Error loading sources:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function openAddModal() {
    editingSource = null;
    formData = {
      name: '',
      url: '',
      logo: '',
      description: '',
      category: 'News',
      is_active: true
    };
    testResult = null;
    showModal = true;
  }
  
  function openEditModal(source) {
    editingSource = source;
    formData = {
      name: source.name,
      url: source.url,
      logo: source.logo || '',
      description: source.description || '',
      category: source.category || 'News',
      is_active: source.is_active
    };
    testResult = null;
    showModal = true;
  }
  
  async function testRssUrl() {
    if (!formData.url) return;
    
    testingUrl = true;
    testResult = null;
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.url })
      });
      
      const data = await res.json();
      testResult = data;
    } catch (error) {
      testResult = { success: false, error: error.message };
    } finally {
      testingUrl = false;
    }
  }
  
  async function saveSource() {
    try {
      const url = editingSource 
        ? `${API_BASE}/api/admin/${editingSource.id}`
        : `${API_BASE}/api/admin`;
      
      const res = await fetch(url, {
        method: editingSource ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showModal = false;
        await loadSources();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error saving source: ' + error.message);
    }
  }
  
  async function toggleActive(source) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/${source.id}/toggle`, {
        method: 'PATCH'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await loadSources();
      }
    } catch (error) {
      alert('Error toggling status: ' + error.message);
    }
  }
  
  async function deleteSource(source) {
    if (!confirm(`Delete "${source.name}"? This will also delete all articles from this source.`)) {
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/${source.id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await loadSources();
        alert(data.message);
      }
    } catch (error) {
      alert('Error deleting source: ' + error.message);
    }
  }
  
  onMount(() => {
    loadSources();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <!-- Navbar -->
  <nav class="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sticky top-0 z-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-6">
          <a href="/" class="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="text-lg font-bold">Admin Panel</span>
          </a>
          
          <div class="flex gap-1">
            <a 
              href="/admin" 
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800"
            >
              RSS Sources
            </a>
            <a 
              href="/admin/categories" 
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Categories
            </a>
          </div>
        </div>
        
        <a 
          href="/" 
          class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Back to Feed
        </a>
      </div>
    </div>
  </nav>
  
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            RSS Sources
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your RSS feed sources and monitor article counts
          </p>
        </div>
        
        <button 
          onclick={openAddModal}
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Source
        </button>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sources</p>
          <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{sources.length}</p>
      </div>
      
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
          <svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-emerald-600">{sources.filter(s => s.is_active).length}</p>
      </div>
      
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Inactive</p>
          <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-slate-600 dark:text-slate-400">{sources.filter(s => !s.is_active).length}</p>
      </div>
      
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Articles</p>
          <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {sources.reduce((sum, s) => sum + parseInt(s.article_count || 0), 0)}
        </p>
      </div>
    </div>
    
    <!-- Sources Table -->
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
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Source
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Articles
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Latest
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              {#each sources as source}
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      onclick={() => toggleActive(source)}
                      aria-label={source.is_active ? 'Deactivate source' : 'Activate source'}
                      class={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
                        source.is_active ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <span
                        class={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          source.is_active ? "translate-x-5" : "translate-x-0"
                        )}
                      ></span>
                    </button>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      {#if source.logo}
                        <img src={source.logo} alt={source.name} class="h-10 w-10 rounded-lg object-cover" />
                      {/if}
                      <div>
                        <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{source.name}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 max-w-md truncate">{source.url}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {source.category || 'News'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`/admin/articles/${source.id}?name=${encodeURIComponent(source.name)}`}
                      class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {source.article_count || 0}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                      {source.latest_article 
                        ? new Date(source.latest_article).toLocaleDateString() 
                        : 'N/A'}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex justify-end gap-2">
                      <button
                        onclick={() => openEditModal(source)}
                        class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onclick={() => deleteSource(source)}
                        class="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
                        title="Delete"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Modal -->
<Dialog.Root bind:open={showModal}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
    <Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <Dialog.Title class="text-xl font-semibold text-slate-900 dark:text-slate-100">
        {editingSource ? 'Edit' : 'Add'} RSS Source
      </Dialog.Title>
      
      <div class="mt-6 space-y-4">
        <div>
          <label for="source-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            id="source-name"
            type="text"
            placeholder="e.g., CNN Indonesia"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.name}
          />
        </div>
        
        <div>
          <label for="source-url" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            RSS URL <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 flex gap-2">
            <input
              id="source-url"
              type="url"
              placeholder="https://example.com/rss"
              class="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              bind:value={formData.url}
            />
            <button
              onclick={testRssUrl}
              disabled={testingUrl || !formData.url}
              class="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {testingUrl ? 'Testing...' : 'Test'}
            </button>
          </div>
          {#if testResult}
            <div class="mt-2">
              {#if testResult.success}
                <p class="text-sm text-emerald-600 dark:text-emerald-400">
                  ✓ Valid RSS feed: {testResult.feed.title} ({testResult.feed.itemCount} items)
                </p>
              {:else}
                <p class="text-sm text-red-600 dark:text-red-400">
                  ✗ {testResult.error}
                </p>
              {/if}
            </div>
          {/if}
        </div>
        
        <div>
          <label for="source-logo" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Logo URL
          </label>
          <input
            id="source-logo"
            type="url"
            placeholder="https://example.com/logo.png"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.logo}
          />
        </div>
        
        <div>
          <label for="source-description" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            id="source-description"
            placeholder="Brief description"
            rows="3"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.description}
          ></textarea>
        </div>
        
        <div>
          <label for="source-category" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            id="source-category"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.category}
          >
            <option value="News">News</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            onclick={() => (formData.is_active = !formData.is_active)}
            aria-label="Toggle active status"
            class={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
              formData.is_active ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
            )}
          >
            <span
              class={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                formData.is_active ? "translate-x-5" : "translate-x-0"
              )}
            ></span>
          </button>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Active (will be scraped)
          </span>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end gap-3">
        <Dialog.Close class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          Cancel
        </Dialog.Close>
        <button
          onclick={saveSource}
          disabled={!formData.name || !formData.url}
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {editingSource ? 'Update' : 'Create'}
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
