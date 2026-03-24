import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
  { path: '/',          name: 'home',      component: HomeView },
  { path: '/about',     name: 'about',     component: AboutView },
  { path: '/portfolio', name: 'portfolio', component: PortfolioView },
  { path: '/contact',   name: 'contact',   component: ContactView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router