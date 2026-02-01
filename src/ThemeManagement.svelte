<script>
  import { onMount } from 'svelte';

  const API_BASE = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:4000';
  
  let currentUser = $state(null);
  
  // Auth check
  onMount(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    
    // Get user info from localStorage
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      currentUser = JSON.parse(userData);
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

  let sliderColors = $state([]);
  let cardColors = $state([]);
  let loading = $state(true);
  let saving = $state(false);
  let message = $state('');

  // Default colors
  const defaultSliderColors = [
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
    "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500"
  ];

  const defaultCardColors = [
    "bg-pink-100", "bg-yellow-100", "bg-green-100", "bg-blue-100",
    "bg-purple-100", "bg-orange-100", "bg-teal-100", "bg-indigo-100",
    "bg-rose-100", "bg-lime-100", "bg-cyan-100", "bg-amber-100",
    "bg-emerald-100", "bg-sky-100", "bg-violet-100", "bg-fuchsia-100",
    "bg-red-100", "bg-slate-100", "bg-stone-100", "bg-zinc-100"
  ];

  // Preset gradients for quick selection
  const gradientPresets = [
    { name: "Pink Purple", value: "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500" },
    { name: "Orange Red", value: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500" },
    { name: "Green Teal", value: "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500" },
    { name: "Blue Sky", value: "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500" },
    { name: "Purple Pink", value: "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500" },
    { name: "Lime Green", value: "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500" },
    { name: "Red Rose", value: "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500" },
    { name: "Cyan Indigo", value: "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500" }
  ];

  const cardColorPresets = [
    { name: "Pink", value: "bg-pink-100" },
    { name: "Yellow", value: "bg-yellow-100" },
    { name: "Green", value: "bg-green-100" },
    { name: "Blue", value: "bg-blue-100" },
    { name: "Purple", value: "bg-purple-100" },
    { name: "Orange", value: "bg-orange-100" },
    { name: "Teal", value: "bg-teal-100" },
    { name: "Indigo", value: "bg-indigo-100" },
    { name: "Rose", value: "bg-rose-100" },
    { name: "Lime", value: "bg-lime-100" },
    { name: "Cyan", value: "bg-cyan-100" },
    { name: "Amber", value: "bg-amber-100" }
  ];

  onMount(async () => {
    await loadTheme();
  });

  async function loadTheme() {
    try {
      const response = await fetch(`${API_BASE}/api/theme`);
      const data = await response.json();
      sliderColors = data.slider_colors || defaultSliderColors;
      cardColors = data.card_colors || defaultCardColors;
    } catch (error) {
      console.error('Error loading theme:', error);
      sliderColors = defaultSliderColors;
      cardColors = defaultCardColors;
    } finally {
      loading = false;
    }
  }

  async function saveTheme() {
    saving = true;
    message = '';
    try {
      const response = await fetch(`${API_BASE}/api/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slider_colors: sliderColors,
          card_colors: cardColors
        })
      });

      if (response.ok) {
        message = '✅ Theme colors saved successfully!';
        setTimeout(() => message = '', 3000);
      } else {
        const error = await response.json();
        message = `❌ Error: ${error.error}`;
      }
    } catch (error) {
      message = `❌ Error: ${error.message}`;
    } finally {
      saving = false;
    }
  }

  async function resetToDefault() {
    if (!confirm('Reset theme colors to default? This cannot be undone.')) return;
    
    saving = true;
    try {
      const response = await fetch(`${API_BASE}/api/theme/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        await loadTheme();
        message = '✅ Theme reset to defaults!';
        setTimeout(() => message = '', 3000);
      }
    } catch (error) {
      message = `❌ Error: ${error.message}`;
    } finally {
      saving = false;
    }
  }

  function addSliderColor() {
    sliderColors = [...sliderColors, gradientPresets[0].value];
  }

  function removeSliderColor(index) {
    sliderColors = sliderColors.filter((_, i) => i !== index);
  }

  function addCardColor() {
    cardColors = [...cardColors, cardColorPresets[0].value];
  }

  function removeCardColor(index) {
    cardColors = cardColors.filter((_, i) => i !== index);
  }
</script>

<div class="min-h-screen bg-base-100 p-6">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-black">Theme Management</h1>
        <p class="text-base-content/60 mt-2">Customize slider and card colors</p>
      </div>
      <a href="/admin/dashboard" class="btn btn-ghost">
        ← Back to Dashboard
      </a>
    </div>

    {#if message}
      <div class="alert {message.startsWith('✅') ? 'alert-success' : 'alert-error'} mb-6">
        {message}
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Slider Colors -->
        <div class="card bg-base-200 border-2 border-neutral shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">
              🎨 Slider Gradient Colors
              <span class="badge badge-primary">{sliderColors.length}</span>
            </h2>
            
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {#each sliderColors as color, index}
                <div class="flex gap-2 items-center">
                  <div class="flex-1">
                    <select 
                      bind:value={sliderColors[index]}
                      class="select select-bordered w-full"
                    >
                      {#each gradientPresets as preset}
                        <option value={preset.value}>{preset.name}</option>
                      {/each}
                    </select>
                    <div class="mt-2 h-16 rounded-lg border-2 border-neutral {color}"></div>
                  </div>
                  <button 
                    onclick={() => removeSliderColor(index)}
                    class="btn btn-sm btn-error btn-square"
                    disabled={sliderColors.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              {/each}
            </div>

            <button onclick={addSliderColor} class="btn btn-primary btn-sm mt-4">
              + Add Slider Color
            </button>
          </div>
        </div>

        <!-- Card Colors -->
        <div class="card bg-base-200 border-2 border-neutral shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">
              🎴 Card Background Colors
              <span class="badge badge-secondary">{cardColors.length}</span>
            </h2>
            
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {#each cardColors as color, index}
                <div class="flex gap-2 items-center">
                  <div class="flex-1">
                    <select 
                      bind:value={cardColors[index]}
                      class="select select-bordered w-full"
                    >
                      {#each cardColorPresets as preset}
                        <option value={preset.value}>{preset.name}</option>
                      {/each}
                    </select>
                    <div class="mt-2 h-16 rounded-lg border-2 border-neutral {color}"></div>
                  </div>
                  <button 
                    onclick={() => removeCardColor(index)}
                    class="btn btn-sm btn-error btn-square"
                    disabled={cardColors.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              {/each}
            </div>

            <button onclick={addCardColor} class="btn btn-secondary btn-sm mt-4">
              + Add Card Color
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 mt-8 justify-end">
        <button 
          onclick={resetToDefault}
          class="btn btn-outline"
          disabled={saving}
        >
          🔄 Reset to Default
        </button>
        <button 
          onclick={saveTheme}
          class="btn btn-primary btn-lg"
          disabled={saving}
        >
          {saving ? 'Saving...' : '💾 Save Theme'}
        </button>
      </div>

      <!-- Preview Note -->
      <div class="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Changes will be reflected on the main feed after saving. Refresh the page to see updates.</span>
      </div>
    {/if}
  </div>
</div>
