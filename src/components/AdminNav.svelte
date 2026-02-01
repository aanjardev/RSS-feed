<!-- Navigation component for admin pages with role-based menu -->
<script>
  export let currentPage = 'dashboard';
  export let currentUser = null;
  export let handleLogout = () => {};
</script>

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
          {#if currentUser?.role === 'admin'}
          <a 
            href="/admin/dashboard" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'dashboard' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            RSS Sources
          </a>
          <a 
            href="/admin/categories" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'categories' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            Categories
          </a>
          {/if}
          <a 
            href="/admin/custom-articles" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'articles' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            Artikel
          </a>
          {#if currentUser?.role === 'admin'}
          <a 
            href="/admin/settings" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'settings' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            Settings
          </a>
          <a 
            href="/admin/theme" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'theme' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            Theme
          </a>
          <a 
            href="/admin/users" 
            class="rounded-lg px-3 py-2 text-sm font-medium {currentPage === 'users' ? 'text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors'}"
          >
            Users
          </a>
          {/if}
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        {#if currentUser}
        <span class="text-sm text-slate-600 dark:text-slate-400">
          {currentUser.name} ({currentUser.role})
        </span>
        {/if}
        <a 
          href="/" 
          class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← Home
        </a>
        <button
          on:click={handleLogout}
          class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
