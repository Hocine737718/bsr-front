import type { RouteRecordRaw } from "vue-router";
import LoginViewVue from "@/views/auth/LoginView.vue";
const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/auth/login",
    component: LoginViewVue,
    meta: { requiresAuth: false, layout: "auth" },
  },
];
export default authRoutes;