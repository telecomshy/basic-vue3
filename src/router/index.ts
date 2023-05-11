import {createRouter, createWebHashHistory} from "vue-router"
import {useAuthStore} from "@/store/auth";

const routes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/Login.vue"),
        meta: {label: "系统登陆"}
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/auth/Register.vue"),
        meta: {label: "用户注册"}
    },
    {
        name: "resetPass",
        path: "/reset-pass",
        component: () => import("@/views/auth/ResetPass.vue"),
        meta: {label: "设置密码"}
    },
    {
        path: "/",
        component: () => import("@/components/Layout.vue"),
        children: [
            {
                name: "index",
                path: "index",
                component: () => import("@/views/index/index.vue"),
                alias: "/",
                meta: {label: "系统首页"}
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
                meta: {label: "用户管理"}
            },
            {
                name: "roleSetting",
                path: "role",
                component: () => import("@/views/setting/role.vue"),
                meta: {label: "角色管理"}
            },
        ]
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
        return {name: "login"}
    }
})

export {router}
