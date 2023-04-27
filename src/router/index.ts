import { createRouter, createWebHashHistory } from "vue-router"
import { useAuthStore } from "@/store/auth";

const routes = [
    {
        name: "index",
        path: "/index",
        component: () => import("@/views/index/Index.vue"),
        alias: "/"
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/login/Index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to) => {
    // 设置白名单，如果未登录，则跳转到login登录页面
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    const authStore = useAuthStore()

    if (authRequired && !authStore.accessToken) {
        // 非正常退出，保留当前路径，下次登录直接跳转到该路径
        authStore.returnUrl = to.fullPath
        return { name: "login" }
    }
})

export { router }
