<script>
  import { onMount } from 'svelte';
  import { Dialog } from 'bits-ui';
  import { cn } from './lib/utils';
  
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
  
  let users = $state([]);
  let loading = $state(true);
  let showModal = $state(false);
  let modalMode = $state('add');
  let currentUser = $state(null);
  let notification = $state({ show: false, message: '', type: '' });
  
  let formData = $state({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });
  
  onMount(() => {
    loadUsers();
  });
  
  async function loadUsers() {
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/api/users`);
      if (!response.ok) throw new Error('Failed to load users');
      users = await response.json();
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification('Failed to load users', 'error');
    } finally {
      loading = false;
    }
  }
  
  function openAddModal() {
    modalMode = 'add';
    formData = { name: '', email: '', password: '', role: 'admin' };
    showModal = true;
  }
  
  function openEditModal(user) {
    modalMode = 'edit';
    currentUser = user;
    formData = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };
    showModal = true;
  }
  
  async function handleSubmit() {
    try {
      if (modalMode === 'add') {
        if (!formData.name || !formData.email || !formData.password) {
          showNotification('All fields are required', 'error');
          return;
        }
        
        const response = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create user');
        }
        
        showNotification('User created successfully', 'success');
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        const response = await fetch(`${API_BASE}/api/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Failed to update user');
        
        // Update password if provided
        if (formData.password) {
          const pwdResponse = await fetch(`${API_BASE}/api/users/${currentUser.id}/password`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: formData.password })
          });
          
          if (!pwdResponse.ok) throw new Error('Failed to update password');
        }
        
        showNotification('User updated successfully', 'success');
      }
      
      showModal = false;
      loadUsers();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  async function handleToggle(user) {
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.id}/toggle`, {
        method: 'PATCH'
      });
      
      if (!response.ok) throw new Error('Failed to toggle user status');
      
      showNotification(`User ${user.is_active ? 'deactivated' : 'activated'}`, 'success');
      loadUsers();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  async function handleDelete(user) {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      showNotification('User deleted successfully', 'success');
      loadUsers();
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
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <!-- Navbar -->
  <nav class="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-6">
          <a href="/" class="flex items-center gap-2 text-slate-900">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-lg font-bold">Admin Panel</span>
          </a>
          
          <div class="flex gap-1">
            <a href="/admin/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              RSS Sources
            </a>
            <a href="/admin/categories" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              Categories
            </a>
            <a href="/admin/custom-articles" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              Articles
            </a>
            <a href="/admin/settings" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              Settings
            </a>
            <a href="/admin/users" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100">
              Users
            </a>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <a href="/" class="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Home
          </a>
          <button
            onclick={handleLogout}
            class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">User Management</h2>
        <p class="text-gray-600 mt-1">Manage admin users and access</p>
      </div>
      <button
        onclick={openAddModal}
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        + Add User
      </button>
    </div>

    {#if loading}
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each users as user}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{user.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    onclick={() => handleToggle(user)}
                    class={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      user.is_active ? 'bg-green-600' : 'bg-gray-300'
                    )}
                    role="switch"
                    aria-checked={user.is_active}
                    aria-label="Toggle user active status"
                  >
                    <span class={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      user.is_active ? 'translate-x-6' : 'translate-x-1'
                    )}></span>
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onclick={() => openEditModal(user)}
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onclick={() => handleDelete(user)}
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Add/Edit Modal -->
  <Dialog.Root bind:open={showModal}>
    <Dialog.Portal>
      <Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Content class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
        <Dialog.Title class="text-xl font-bold mb-4">
          {modalMode === 'add' ? 'Add New User' : 'Edit User'}
        </Dialog.Title>
        
        <div class="space-y-4">
          <div>
            <label for="user-name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="user-name"
              type="text"
              bind:value={formData.name}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label for="user-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="user-email"
              type="email"
              bind:value={formData.email}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label for="user-password" class="block text-sm font-medium text-gray-700 mb-1">
              Password {modalMode === 'edit' ? '(leave blank to keep current)' : ''}
            </label>
            <input
              id="user-password"
              type="password"
              bind:value={formData.password}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={modalMode === 'add'}
            />
          </div>
          
          <div>
            <label for="user-role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="user-role"
              bind:value={formData.role}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="kontributor">Kontributor</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <Dialog.Close class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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
