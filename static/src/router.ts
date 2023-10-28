import { createRouter, createWebHistory } from 'vue-router';
import type {
    RouteRecordRaw,
    NavigationGuardNext,
    RouteLocationNormalized,
} from 'vue-router';
import Login from "./components/Login.vue";
import Home from './components/Home.vue';
import Dashboard from "./components/Dashboard.vue";
import store from "./store";

/**
 * @description: Create the router
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * @description: Check if the route requires authentication
 */
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const requiresAuth = to.meta.requiresAuth as boolean;

    if (requiresAuth && !store.getters.isAuthenticated) {
        next({
            path: "/login",
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
})

export default router
