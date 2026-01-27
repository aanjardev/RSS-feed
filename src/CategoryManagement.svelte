<script>
  import { onMount } from 'svelte';
  import { Dialog } from 'bits-ui';
  import { cn } from './lib/utils';
  
  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  let categories = $state([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let editingCategory = $state(null);
  
  let formData = $state({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    is_active: true
  });
  
  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#ef4444', label: 'Red' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#84cc16', label: 'Lime' }
  ];
  
  async function loadCategories() {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      if (data.success) {
        categories = data.categories;
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function openAddModal() {
    editingCategory = null;
    formData = {
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#3b82f6',
      is_active: true
    };
    showModal = true;
  }
  
  function openEditModal(category) {
    editingCategory = category;
    formData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3b82f6',
      is_active: category.is_active
    };
    showModal = true;
  }
  
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  function onNameChange(name) {
    formData.name = name;
    if (!editingCategory) {
      formData.slug = generateSlug(name);
    }
  }
  
  async function saveCategory() {
    try {
      const url = editingCategory 
        ? `${API_BASE}/api/categories/${editingCategory.id}`
        : `${API_BASE}/api/categories`;
      
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showModal = false;
        await loadCategories();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error saving category: ' + error.message);
    }
  }
  
  async function toggleActive(category) {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${category.id}/toggle`, {
        method: 'PATCH'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await loadCategories();
      }
    } catch (error) {
      alert('Error toggling status: ' + error.message);
    }
  }
  
  async function deleteCategory(category) {
    if (category.source_count > 0) {
      if (!confirm(`This category has ${category.source_count} sources. Deleting it will unassign all sources. Continue?`)) {
        return;
      }
    } else if (!confirm(`Delete "${category.name}"?`)) {
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/categories/${category.id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        await loadCategories();
        alert(data.message);
      }
    } catch (error) {
      alert('Error deleting category: ' + error.message);
    }
  }
  
  onMount(() => {
    loadCategories();
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
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              RSS Sources
            </a>
            <a 
              href="/admin/categories" 
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800"
            >
              Categories
            </a>
            <a 
              href="/admin/settings" 
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Settings
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
            Categories
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage article categories for RSS sources
          </p>
        </div>
        
        <button 
          onclick={openAddModal}
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Categories</p>
          <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{categories.length}</p>
      </div>
      
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
          <svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-emerald-600">{categories.filter(c => c.is_active).length}</p>
      </div>
      
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sources</p>
          <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {categories.reduce((sum, c) => sum + parseInt(c.source_count || 0), 0)}
        </p>
      </div>
    </div>
    
    <!-- Categories Grid -->
    {#if isLoading}
      <div class="flex justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
      </div>
    {:else}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each categories as category}
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div 
                  class="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style="background-color: {category.color}20; color: {category.color}"
                >
                  {category.icon || '📁'}
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-slate-100">{category.name}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{category.source_count} sources</p>
                </div>
              </div>
              
              <button
                onclick={() => toggleActive(category)}
                aria-label={category.is_active ? 'Deactivate category' : 'Activate category'}
                class={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
                  category.is_active ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <span
                  class={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    category.is_active ? "translate-x-5" : "translate-x-0"
                  )}
                ></span>
              </button>
            </div>
            
            {#if category.description}
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
            {/if}
            
            <div class="mt-4 flex gap-2">
              <button
                onclick={() => openEditModal(category)}
                class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Edit
              </button>
              <button
                onclick={() => deleteCategory(category)}
                class="flex-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Modal -->
<Dialog.Root bind:open={showModal}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
    <Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <Dialog.Title class="text-xl font-semibold text-slate-900 dark:text-slate-100">
        {editingCategory ? 'Edit' : 'Add'} Category
      </Dialog.Title>
      
      <div class="mt-6 space-y-4">
        <div>
          <label for="cat-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            id="cat-name"
            type="text"
            placeholder="e.g., Technology"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            value={formData.name}
            oninput={(e) => onNameChange(e.target.value)}
          />
        </div>
        
        <div>
          <label for="cat-slug" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Slug <span class="text-red-500">*</span>
          </label>
          <input
            id="cat-slug"
            type="text"
            placeholder="e.g., technology"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.slug}
          />
        </div>
        
        <div>
          <label for="cat-icon" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Icon (emoji)
          </label>
          <input
            id="cat-icon"
            type="text"
            placeholder="e.g., 💻"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.icon}
          />
        </div>
        
        <div>
          <label for="cat-color" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Color
          </label>
          <select
            id="cat-color"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.color}
          >
            {#each colorOptions as option}
              <option value={option.value}>
                {option.label}
              </option>
            {/each}
          </select>
        </div>
        
        <div>
          <label for="cat-description" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            id="cat-description"
            placeholder="Brief description"
            rows="3"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            bind:value={formData.description}
          ></textarea>
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
            Active
          </span>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end gap-3">
        <Dialog.Close class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          Cancel
        </Dialog.Close>
        <button
          onclick={saveCategory}
          disabled={!formData.name || !formData.slug}
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {editingCategory ? 'Update' : 'Create'}
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
