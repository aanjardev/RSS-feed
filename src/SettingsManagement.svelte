<script>
  import { onMount } from 'svelte';
  import { cn } from './lib/utils';
  
  const API_BASE = 'http://localhost:4000/api';
  
  let settings = $state([]);
  let loading = $state(true);
  let saving = $state(false);
  let activeCategory = $state('general');
  let notification = $state({ show: false, message: '', type: '' });
  
  // File upload states
  let uploadingFiles = $state({});
  
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'appearance', label: 'Appearance' },
    { value: 'content', label: 'Content' }
  ];
  
  onMount(async () => {
    await fetchSettings();
  });
  
  async function fetchSettings() {
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      settings = await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('Failed to load settings', 'error');
    } finally {
      loading = false;
    }
  }
  
  async function updateSetting(key, value) {
    saving = true;
    try {
      const response = await fetch(`${API_BASE}/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: String(value) })
      });
      
      if (!response.ok) throw new Error('Failed to update setting');
      
      // Update local state
      settings = settings.map(s => 
        s.key === key ? { ...s, value: String(value) } : s
      );
      
      showNotification('Setting updated successfully', 'success');
    } catch (error) {
      console.error('Error updating setting:', error);
      showNotification('Failed to update setting', 'error');
    } finally {
      saving = false;
    }
  }
  
  async function uploadFile(key, file) {
    uploadingFiles[key] = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      
      const response = await fetch(`${API_BASE}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      
      const data = await response.json();
      
      // Update local state
      settings = settings.map(s => 
        s.key === key ? { ...s, value: data.setting.value } : s
      );
      
      showNotification('File uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('Failed to upload file', 'error');
    } finally {
      uploadingFiles[key] = false;
    }
  }
  
  function showNotification(message, type) {
    notification = { show: true, message, type };
    setTimeout(() => {
      notification = { show: false, message: '', type: '' };
    }, 3000);
  }
  
  function handleFileChange(key, event) {
    const file = event.target.files[0];
    if (file) {
      uploadFile(key, file);
    }
  }
  
  function getCategorySettings(category) {
    return settings.filter(s => s.category === category);
  }
  
  function renderSettingInput(setting) {
    switch (setting.type) {
      case 'boolean':
        return 'toggle';
      case 'number':
        return 'number';
      case 'file':
        return 'file';
      default:
        return 'text';
    }
  }
</script>

<!-- Navbar -->
<div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center space-x-8">
        <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <nav class="flex space-x-4">
          <a href="/admin" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            RSS Sources
          </a>
          <a href="/admin/categories" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            Categories
          </a>
          <a href="/admin/settings" class="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
            Settings
          </a>
        </nav>
      </div>
      <a href="/" class="text-sm font-medium text-blue-600 hover:text-blue-700">
        ← Back to Feed
      </a>
    </div>
  </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Notification -->
  {#if notification.show}
    <div class={cn(
      "fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg",
      notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    )}>
      {notification.message}
    </div>
  {/if}

  <!-- Header -->
  <div class="mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
    <p class="text-gray-600">Manage your site configuration and preferences</p>
  </div>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <!-- Category Tabs -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="flex space-x-8">
        {#each categories as category}
          <button
            onclick={() => activeCategory = category.value}
            class={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeCategory === category.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {category.label}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Settings Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 space-y-6">
        {#each getCategorySettings(activeCategory) as setting (setting.key)}
          <div class="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <label class="block text-sm font-semibold text-gray-900 mb-1">
                  {setting.label}
                </label>
                {#if setting.description}
                  <p class="text-sm text-gray-500 mb-3">{setting.description}</p>
                {/if}
                
                <!-- Input based on type -->
                {#if setting.type === 'boolean'}
                  <!-- Toggle Switch -->
                  <button
                    onclick={() => updateSetting(setting.key, setting.value !== 'true')}
                    class={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      setting.value === 'true' ? 'bg-blue-600' : 'bg-gray-200'
                    )}
                    role="switch"
                    aria-checked={setting.value === 'true'}
                    aria-label={`Toggle ${setting.label}`}
                  >
                    <span
                      class={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        setting.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                  <span class="ml-3 text-sm text-gray-600">
                    {setting.value === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                  
                {:else if setting.type === 'number'}
                  <!-- Number Input -->
                  <input
                    type="number"
                    value={setting.value}
                    onchange={(e) => updateSetting(setting.key, e.target.value)}
                    class="mt-1 block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  />
                  
                {:else if setting.type === 'file'}
                  <!-- File Upload -->
                  <div class="mt-2 space-y-3">
                    {#if setting.value}
                      <div class="flex items-center space-x-3">
                        <img 
                          src={setting.value} 
                          alt="Preview" 
                          class="h-10 w-10 object-contain rounded border border-gray-200"
                          onerror={(e) => e.target.style.display = 'none'}
                        />
                        <span class="text-sm text-gray-600">{setting.value}</span>
                      </div>
                    {/if}
                    <div>
                      <label class={cn(
                        "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer transition-colors",
                        uploadingFiles[setting.key] && "opacity-50 cursor-not-allowed"
                      )}>
                        {#if uploadingFiles[setting.key]}
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        {:else}
                          <svg class="-ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Choose File
                        {/if}
                        <input
                          type="file"
                          accept="image/*"
                          onchange={(e) => handleFileChange(setting.key, e)}
                          class="sr-only"
                          disabled={uploadingFiles[setting.key]}
                        />
                      </label>
                      <p class="mt-1 text-xs text-gray-500">PNG, JPG, ICO, SVG up to 2MB</p>
                    </div>
                  </div>
                  
                {:else}
                  <!-- Text Input -->
                  <input
                    type="text"
                    value={setting.value}
                    onchange={(e) => updateSetting(setting.key, e.target.value)}
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  />
                {/if}
              </div>
              
              <!-- Key Badge -->
              <div class="ml-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                  {setting.key}
                </span>
              </div>
            </div>
          </div>
        {/each}
        
        {#if getCategorySettings(activeCategory).length === 0}
          <div class="text-center py-12 text-gray-500">
            No settings in this category
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
