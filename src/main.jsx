import './index.css'
import App from './App.svelte'
import Login from './Login.svelte'
import Admin from './AdminShadcn.svelte'
import CategoryManagement from './CategoryManagement.svelte'
import ArticleManagement from './ArticleManagement.svelte'
import SettingsManagement from './SettingsManagement.svelte'
import UserManagement from './UserManagement.svelte'
import CustomArticlesManagement from './CustomArticlesManagement.svelte'
import ArticlePage from './ArticlePage.svelte'
import About from './About.svelte'
import ThemeManagement from './ThemeManagement.svelte'
import TermsOfService from './TermsOfService.svelte'
import { mount } from 'svelte'

// Simple client-side router
function router() {
  const path = window.location.pathname
  const root = document.getElementById('root')
  root.innerHTML = ''
  
  // Match article page route /artikel/:slug
  const articlePageMatch = path.match(/^\/artikel\/([a-z0-9-]+)$/)
  if (articlePageMatch) {
    const slug = articlePageMatch[1]
    mount(ArticlePage, { 
      target: root,
      props: { slug }
    })
    return
  }
  
  // Match article management route with ID
  const articleMatch = path.match(/^\/admin\/articles\/(\d+)$/)
  if (articleMatch) {
    const sourceId = articleMatch[1]
    const params = new URLSearchParams(window.location.search)
    const sourceName = params.get('name') || 'Unknown Source'
    
    mount(ArticleManagement, { 
      target: root,
      props: { sourceId, sourceName }
    })
    return
  }
  
  // Static routes
  const routes = {
    '/': App,
    '/about': About,
    '/terms': TermsOfService,
    '/admin': Login,
    '/admin/dashboard': Admin,
    '/admin/categories': CategoryManagement,
    '/admin/custom-articles': CustomArticlesManagement,
    '/admin/settings': SettingsManagement,
    '/admin/users': UserManagement,
    '/admin/theme': ThemeManagement
  }
  
  const Component = routes[path] || App
  mount(Component, { target: root })
}

// Listen to navigation
window.addEventListener('popstate', router)
window.addEventListener('DOMContentLoaded', router)

// Export navigation function for use in components
export function navigateTo(path) {
  window.history.pushState({}, '', path)
  router()
}

// Initial route
router()

