import './index.css'
import App from './App.svelte'
import Admin from './Admin.svelte'
import { mount } from 'svelte'

// Simple client-side router
const routes = {
  '/': App,
  '/admin': Admin
}

function router() {
  const path = window.location.pathname
  const Component = routes[path] || App
  
  // Clear existing
  const root = document.getElementById('root')
  root.innerHTML = ''
  
  // Mount component
  mount(Component, { target: root })
}

// Listen to navigation
window.addEventListener('popstate', router)
window.addEventListener('DOMContentLoaded', router)

// Initial route
router()

