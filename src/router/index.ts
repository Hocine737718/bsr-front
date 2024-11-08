import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import authRoutes from './auth.routes';
import { useAuthStore } from '@/stores/auth.store';

const routes: Array<RouteRecordRaw> = [
  { path: "/:pathMatch(.*)*", redirect: "/" },
  {
    path: "/",
    component: DashboardView,
    meta: { requiresAuth: true, layout: "default" },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    ...authRoutes,
  ],
});

router.beforeEach((to, from, next) => {
  if (
    to.meta.requiresAuth &&
    !useAuthStore().user &&
    !useAuthStore().isLoggedIn() &&
    to.fullPath != "/auth/login"
  ) {
    next("/auth/login");
  }
  else {
    next();
  }
});

export default router;
