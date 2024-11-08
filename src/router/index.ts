import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    // path: '/',
    // name: 'home',
    // component: HomeView,
    // meta: { ensure: Required.NULL }
    // }
  ]
})

router.beforeEach((to, from, next) => {
  // if (to.meta.ensure === Required.NO_AUTH && useAuthStore().isLoggedIn()) {
  //   next('/')
  // } else if (to.meta.ensure === Required.AUTH && !useAuthStore().isLoggedIn()) {
  //   next('/login')
  // } else {
  //   next()
  // }
})

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

export default router
