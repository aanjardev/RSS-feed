<script>
  import { onMount } from 'svelte';
  import { Dialog } from 'bits-ui';
  import { cn } from './lib/utils';
  import QuillEditor from './components/QuillEditor.svelte';
  
  const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:3000';
  
  // Auth check
  onMount(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin';
      }
    } catch (error) {
      window.location.href = '/admin';
    }
  });
  
  function handleLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/';
  }
  
  let articles = $state([]);
  let categories = $state([]);
  let loading = $state(true);
  let showModal = $state(false);
  let modalMode = $state('add');
  let currentArticle = $state(null);
  let notification = $state({ show: false, message: '', type: '' });
  let filterPublished = $state('all');
  let searchQuery = $state('');
  let imageUploadMode = $state('url'); // 'url' or 'upload'
  let uploadingImage = $state(false);
  
  // Computed filtered articles
  let filteredArticles = $derived.by(() => {
    let filtered = articles;
    
    // Filter by published status
    if (filterPublished === 'published') {
      filtered = filtered.filter(a => a.is_published);
    } else if (filterPublished === 'draft') {
      filtered = filtered.filter(a => !a.is_published);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        (a.description && a.description.toLowerCase().includes(query)) ||
        (a.source_name && a.source_name.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  });
  
  let formData = $state({
    title: '',
    description: '',
    content: '',
    image_url: '',
    link: '',
    author: '',
    source_name: 'Papua.News',
    category_id: null,
    is_published: true,
    is_featured: false,
    pub_date: new Date().toISOString().slice(0, 16)
  });
  
  onMount(() => {
    loadArticles();
    loadCategories();
  });
  
  async function loadCategories() {
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      if (!response.ok) throw new Error('Failed to load categories');
      const data = await response.json();
      categories = data.categories || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      categories = [];
    }
  }
  
  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size must be less than 5MB', 'error');
      return;
    }
    
    uploadingImage = true;
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const response = await fetch(`${API_BASE}/api/upload/image`, {
        method: 'POST',
        body: formDataUpload
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      formData.image_url = data.imageUrl;
      showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Failed to upload image', 'error');
    } finally {
      uploadingImage = false;
    }
  }
  
  async function loadArticles() {
    loading = true;
    try {
      // Load all articles without filtering - we'll filter in frontend
      const response = await fetch(`${API_BASE}/api/custom-articles?limit=100`);
      if (!response.ok) throw new Error('Failed to load articles');
      const data = await response.json();
      articles = data.articles;
    } catch (error) {
      console.error('Error loading articles:', error);
      showNotification('Failed to load articles', 'error');
    } finally {
      loading = false;
    }
  }
  
  function openAddModal() {
    modalMode = 'add';
    formData = {
      title: '',
      description: '',
      content: '',
      image_url: '',
      link: '',
      author: '',
      source_name: 'Papua.News',
      category_id: null,
      is_published: true,
      is_featured: false,
      pub_date: new Date().toISOString().slice(0, 16)
    };
    showModal = true;
  }
  
  function openEditModal(article) {
    modalMode = 'edit';
    currentArticle = article;
    formData = {
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      image_url: article.image_url || '',
      link: article.link || '',
      author: article.author || '',
      source_name: article.source_name || 'Editorial',
      category_id: article.category_id,
      is_published: article.is_published,
      is_featured: article.is_featured,
      pub_date: new Date(article.pub_date).toISOString().slice(0, 16)
    };
    showModal = true;
  }
  
  async function handleSubmit() {
    try {
      if (!formData.title.trim()) {
        showNotification('Title is required', 'error');
        return;
      }
      
      const payload = {
        ...formData,
        pub_date: new Date(formData.pub_date).toISOString()
      };
      
      const url = modalMode === 'add' 
        ? `${API_BASE}/api/custom-articles`
        : `${API_BASE}/api/custom-articles/${currentArticle.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save article');
      }
      
      showNotification(
        modalMode === 'add' ? 'Article created successfully' : 'Article updated successfully',
        'success'
      );
      showModal = false;
      loadArticles();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  async function handleTogglePublished(article) {
    try {
      const response = await fetch(`${API_BASE}/api/custom-articles/${article.id}/toggle-published`, {
        method: 'PATCH'
      });
      
      if (!response.ok) throw new Error('Failed to toggle published status');
      
      showNotification(`Article ${article.is_published ? 'unpublished' : 'published'}`, 'success');
      loadArticles();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  async function handleToggleFeatured(article) {
    try {
      const response = await fetch(`${API_BASE}/api/custom-articles/${article.id}/toggle-featured`, {
        method: 'PATCH'
      });
      
      if (!response.ok) throw new Error('Failed to toggle featured status');
      
      showNotification(`Article ${article.is_featured ? 'unfeatured' : 'featured'}`, 'success');
      loadArticles();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  async function handleDelete(article) {
    if (!confirm(`Delete article "${article.title}"?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/custom-articles/${article.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete article');
      
      showNotification('Article deleted successfully', 'success');
      loadArticles();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  function showNotification(message, type) {
    notification = { show: true, message, type };
    setTimeout(() => {
      notification = { show: false, message: '', type: '' };
    }, 3000);
  }
  
  $effect(() => {
    if (filterPublished || searchQuery !== undefined) {
      loadArticles();
    }
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-lg font-bold">Admin Panel</span>
          </a>
          
          <div class="flex gap-1">
            <a href="/admin/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors">
              RSS Sources
            </a>
            <a href="/admin/categories" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors">
              Categories
            </a>
            <a href="/admin/custom-articles" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800">
              Articles
            </a>
            <a href="/admin/settings" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors">
              Settings
            </a>
            <a href="/admin/users" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors">
              Users
            </a>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <a href="/" class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            ← Home
          </a>
          <button
            onclick={handleLogout}
            class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Notification -->
  {#if notification.show}
    <div class={cn(
      "fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg",
      notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    )}>
      {notification.message}
    </div>
  {/if}

  <!-- Main Content -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-slate-100">Custom Articles</h2>
          <p class="text-gray-600 dark:text-slate-400 mt-1">Create and manage editorial articles</p>
        </div>
        <button
          onclick={openAddModal}
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </button>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 mb-4">
        <select
          bind:value={filterPublished}
          class="rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search articles..."
          class="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            {#each filteredArticles as article}
              <tr class="hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    {#if article.is_featured}
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    {/if}
                    <div class="min-w-0">
                      <div class="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{article.title}</div>
                      {#if article.description}
                        <div class="text-xs text-gray-500 dark:text-slate-400 truncate">{article.description.slice(0, 60)}...</div>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{article.source_name}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {#if article.category_name}
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {article.category_name}
                    </span>
                  {:else}
                    <span class="text-xs text-gray-400">Uncategorized</span>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    article.is_published ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'
                  )}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                  {new Date(article.pub_date).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      onclick={() => handleToggleFeatured(article)}
                      class={cn(
                        "px-2 py-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20 rounded border border-transparent hover:border-yellow-300",
                        article.is_featured && "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400"
                      )}
                      title={article.is_featured ? 'Unfeature' : 'Feature'}
                      aria-label={article.is_featured ? 'Unfeature article' : 'Feature article'}
                    >
                      ★
                    </button>
                    <button
                      onclick={() => handleTogglePublished(article)}
                      class="px-2 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded border border-transparent hover:border-blue-300"
                      title={article.is_published ? 'Unpublish' : 'Publish'}
                      aria-label={article.is_published ? 'Unpublish article' : 'Publish article'}
                    >
                      {article.is_published ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      onclick={() => openEditModal(article)}
                      class="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded border border-indigo-600"
                      aria-label="Edit article"
                    >
                      Edit
                    </button>
                    <button
                      onclick={() => handleDelete(article)}
                      class="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded border border-red-600"
                      aria-label="Delete article"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        
        {#if filteredArticles.length === 0 && !loading}
          <div class="text-center py-12 text-gray-500 dark:text-slate-400">
            {searchQuery || filterPublished !== 'all' ? 'No articles match your filters' : 'No articles found. Create your first custom article!'}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Add/Edit Modal -->
  <Dialog.Root bind:open={showModal}>
    <Dialog.Portal>
      <Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Content class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50">
        <Dialog.Title class="text-xl font-bold mb-4 dark:text-slate-100">
          {modalMode === 'add' ? 'Create New Article' : 'Edit Article'}
        </Dialog.Title>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label for="article-title" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title *</label>
              <input
                id="article-title"
                type="text"
                bind:value={formData.title}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="col-span-2">
              <label for="article-description" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Short Description</label>
              <textarea
                id="article-description"
                bind:value={formData.description}
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div class="col-span-2">
              <div class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Content</div>
              <QuillEditor 
                value={formData.content}
                onChange={(html) => formData.content = html}
              />
            </div>
            
            <div class="col-span-2">
              <div class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Image</div>
              
              <!-- Toggle between URL and Upload -->
              <div class="flex gap-2 mb-3">
                <button
                  type="button"
                  onclick={() => imageUploadMode = 'url'}
                  class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageUploadMode === 'url' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onclick={() => imageUploadMode = 'upload'}
                  class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageUploadMode === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                  }`}
                >
                  Upload Image
                </button>
              </div>
              
              {#if imageUploadMode === 'url'}
                <input
                  id="article-image"
                  type="url"
                  bind:value={formData.image_url}
                  placeholder="https://example.com/image.jpg"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              {:else}
                <div class="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onchange={handleImageUpload}
                    disabled={uploadingImage}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-600 dark:file:text-slate-100"
                  />
                  {#if uploadingImage}
                    <p class="text-sm text-blue-600 dark:text-blue-400">Uploading...</p>
                  {/if}
                  {#if formData.image_url}
                    <p class="text-sm text-green-600 dark:text-green-400">✓ Image uploaded successfully</p>
                  {/if}
                </div>
              {/if}
              
              <!-- Image Preview -->
              {#if formData.image_url}
                <div class="mt-3">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    class="max-w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-slate-600"
                  />
                </div>
              {/if}
            </div>
            
            <div>
              <label for="article-link" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">External Link</label>
              <input
                id="article-link"
                type="url"
                bind:value={formData.link}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="article-source" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Source Name</label>
              <input
                id="article-source"
                type="text"
                bind:value={formData.source_name}
                readonly
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-lg cursor-not-allowed"
                title="Source name is fixed for consistency"
              />
            </div>
            
            <div>
              <label for="article-author" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Author</label>
              <input
                id="article-author"
                type="text"
                bind:value={formData.author}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="article-category" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Category</label>
              <select
                id="article-category"
                bind:value={formData.category_id}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={null}>-- Select Category --</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label for="article-date" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Publish Date</label>
              <input
                id="article-date"
                type="datetime-local"
                bind:value={formData.pub_date}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div class="col-span-2 flex gap-6">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  bind:checked={formData.is_published}
                  class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-slate-300">Published</span>
              </label>
              
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  bind:checked={formData.is_featured}
                  class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-slate-300">Featured</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <Dialog.Close class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            Cancel
          </Dialog.Close>
          <button
            onclick={handleSubmit}
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {modalMode === 'add' ? 'Create' : 'Update'}
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>
