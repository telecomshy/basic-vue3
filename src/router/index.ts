import {createRouter, createWebHistory} from "vue-router"
import {useAuthStore} from "@/stores/auth";

const routes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/Login.vue"),
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/auth/Register.vue"),
    },
    {
        name: "resetPass",
        path: "/reset-pass",
        component: () => import("@/views/auth/ResetPass.vue"),
    },
    {
        path: "/",
        component: () => import("@/components/Layout.vue"),
        children: [
            {
                name: "index",
                path: "index",
                component: () => import("@/views/index/index.vue"),
                alias: "",
            }
        ]
    },
    {
        path: "/setting",
        component: () => import("@/components/Layout.vue"),
        children: [
            {
                name: "userSetting",
                path: "user",
                component: () => import("@/views/setting/user.vue"),
            },
            {
                name: "roleSetting",
                path: "role",
                component: () => import("@/views/setting/role.vue"),
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const WHITE_LIST = ['/login', '/register']

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (!authStore.isLogin && !WHITE_LIST.includes(to.path)) {
        return {name: "login"}
    }
})

export {router}
