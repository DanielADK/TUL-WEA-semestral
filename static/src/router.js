import { createRouter, createWebHistory } from 'vue-router';
import LoginScreen from "@/components/LoginScreen.vue";
import Home from '@/components/Home.vue';

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
