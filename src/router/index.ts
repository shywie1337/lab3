import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'feed', component: () => import('../views/FeedView.vue') },
    { path: '/trips/:id', name: 'trip', component: () => import('../views/TripView.vue'), props: true },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/cabinet',
      component: () => import('../views/CabinetView.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'new-trip' } },
        { path: 'new-trip', name: 'new-trip', component: () => import('../views/NewTripView.vue') },
        { path: 'profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
      ],
    },
    { path: '/404', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
    { path: '/:pathMatch(.*)*', name: 'unknown', component: () => import('../views/NotFoundView.vue') },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isLoggedIn) return { name: 'feed' }
})
