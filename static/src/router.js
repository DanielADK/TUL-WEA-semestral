import { createRouter, createWebHistory } from 'vue-router';
import LoginScreen from "@/components/Login.vue";
import Home from '@/components/Home.vue';
import Dashboard from "@/components/Dashboard.vue";
import store from "@/store";

const routes =[
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/login",
        name: "login",
        component: LoginScreen
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

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next({
                path: "/login",
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router
