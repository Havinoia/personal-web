import { createRouter, createWebHistory } from 'vue-router'
import { encodeProjectId } from '../utils/hashId'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
  { path: '/',          name: 'home',      component: HomeView },
  { path: '/about',     name: 'about',     component: AboutView },
  { path: '/portfolio', name: 'portfolio', component: PortfolioView },
  { path: '/contact',   name: 'contact',   component: ContactView },
  { 
    path: '/project/:id', 
    name: 'project-detail', 
    component: () => import('../views/project/ProjectDetailView.vue'),
    meta: { secureId: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return false
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta?.secureId && to.params?.id && /^\d+$/.test(to.params.id)) {
    const hashedId = encodeProjectId(to.params.id)
    if (hashedId) {
      return next({ name: to.name, params: { ...to.params, id: hashedId }, replace: true })
    }
  }
  next()
})

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} | havin.dev` : 'havin.dev'
})

export default router