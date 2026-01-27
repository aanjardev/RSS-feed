<script>
  import { onMount } from 'svelte';
  import { Dialog } from 'bits-ui';
  import { cn } from '$lib/utils';
  
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

<div class="min-h-screen bg-base-200 p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-3">
        <a href="/" class="btn btn-ghost btn-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Feed
        </a>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">RSS Sources Admin</h1>
          <p class="text-sm opacity-70 mt-1">Manage your RSS feeds</p>
        </div>
        <button 
          class="btn btn-primary" 
          onclick={openAddModal}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add RSS Source
        </button>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="stats shadow mb-6 w-full">
      <div class="stat">
        <div class="stat-title">Total Sources</div>
        <div class="stat-value">{sources.length}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Active Sources</div>
        <div class="stat-value text-success">{sources.filter(s => s.is_active).length}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Inactive Sources</div>
        <div class="stat-value text-error">{sources.filter(s => !s.is_active).length}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Total Articles</div>
        <div class="stat-value">{sources.reduce((sum, s) => sum + parseInt(s.article_count || 0), 0)}</div>
      </div>
    </div>
    
    <!-- Sources Table -->
    {#if isLoading}
      <div class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else}
      <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Category</th>
              <th>URL</th>
              <th>Articles</th>
              <th>Latest</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each sources as source}
              <tr>
                <td>
                  <input 
                    type="checkbox" 
                    class="toggle toggle-success" 
                    checked={source.is_active}
                    onchange={() => toggleActive(source)}
                  />
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    {#if source.logo}
                      <img src={source.logo} alt={source.name} class="w-8 h-8 rounded" />
                    {/if}
                    <div>
                      <div class="font-bold">{source.name}</div>
                      <div class="text-xs opacity-50">{source.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-ghost">{source.category}</span>
                </td>
                <td>
                  <a href={source.url} target="_blank" class="link link-primary text-xs truncate max-w-xs block">
                    {source.url}
                  </a>
                </td>
                <td>{source.article_count || 0}</td>
                <td class="text-xs">
                  {source.latest_article 
                    ? new Date(source.latest_article).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-sm btn-ghost" 
                      onclick={() => openEditModal(source)}
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      class="btn btn-sm btn-ghost text-error" 
                      onclick={() => deleteSource(source)}
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Modal -->
{#if showModal}
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">
        {editingSource ? 'Edit' : 'Add'} RSS Source
      </h3>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label" for="source-name">
            <span class="label-text">Name *</span>
          </label>
          <input 
            id="source-name"
            type="text" 
            placeholder="e.g., CNN Indonesia" 
            class="input input-bordered"
            bind:value={formData.name}
          />
        </div>
        
        <div class="form-control">
          <label class="label" for="source-url">
            <span class="label-text">RSS URL *</span>
          </label>
          <div class="join w-full">
            <input 
              id="source-url"
              type="url" 
              placeholder="https://example.com/rss" 
              class="input input-bordered join-item flex-1"
              bind:value={formData.url}
            />
            <button 
              class="btn join-item" 
              onclick={testRssUrl}
              disabled={testingUrl || !formData.url}
            >
              {testingUrl ? 'Testing...' : 'Test URL'}
            </button>
          </div>
          {#if testResult}
            <div class="label">
              {#if testResult.success}
                <span class="label-text-alt text-success">
                  ✓ Valid RSS feed: {testResult.feed.title} ({testResult.feed.itemCount} items)
                </span>
              {:else}
                <span class="label-text-alt text-error">
                  ✗ {testResult.error}
                </span>
              {/if}
            </div>
          {/if}
        </div>
        
        <div class="form-control">
          <label class="label" for="source-logo">
            <span class="label-text">Logo URL</span>
          </label>
          <input 
            id="source-logo"
            type="url" 
            placeholder="https://example.com/logo.png" 
            class="input input-bordered"
            bind:value={formData.logo}
          />
        </div>
        
        <div class="form-control">
          <label class="label" for="source-description">
            <span class="label-text">Description</span>
          </label>
          <textarea 
            id="source-description"
            class="textarea textarea-bordered" 
            placeholder="Brief description"
            bind:value={formData.description}
          ></textarea>
        </div>
        
        <div class="form-control">
          <label class="label" for="source-category">
            <span class="label-text">Category</span>
          </label>
          <select id="source-category" class="select select-bordered" bind:value={formData.category}>
            <option value="News">News</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input 
              type="checkbox" 
              class="toggle toggle-success"
              bind:checked={formData.is_active}
            />
            <span class="label-text">Active (will be scraped)</span>
          </label>
        </div>
      </div>
      
      <div class="modal-action">
        <button class="btn" onclick={() => (showModal = false)}>Cancel</button>
        <button 
          class="btn btn-primary" 
          onclick={saveSource}
          disabled={!formData.name || !formData.url}
        >
          {editingSource ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-open {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
