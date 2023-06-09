import {createRouter, createWebHistory} from "vue-router"
import {useAuthStore} from "@/stores/auth";

const routes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/Login.vue"),
        meta: {
            label: "用户登陆"
        }
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/auth/Register.vue"),
        meta: {
            label: "用户注册"
        }
    },
    {
        path: "/",
        component: () => import("@/views/layout/Layout.vue"),
        children: [
            {
                name: "index",
                path: "",
                component: () => import("@/views/index/index.vue"),
                alias: "index",
                meta: {
                    label: "系统首页"
                }
            },
            {
                name: "user",
                path: "user",
                component: () => import("@/views/setting/User.vue"),
                meta: {
                    label: "用户管理"
                }
            },
            {
                name: "role",
                path: "role",
                component: () => import("@/views/setting/Role.vue"),
                meta: {
                    label: "角色管理"
                }
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

    if (!authStore.loggedIn && !WHITE_LIST.includes(to.path)) {
        return {name: "login"}
    }
})

export {router}
