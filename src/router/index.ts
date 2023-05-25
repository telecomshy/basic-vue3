import {createRouter, createWebHistory} from "vue-router"
import useSecurity from "@/service/security"

const {isLogin} = useSecurity()


const routes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/Login.vue"),
        meta: {loginRequired: false}
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/auth/Register.vue"),
        meta: {loginRequired: false}
    },
    {
        name: "resetPass",
        path: "/reset-pass",
        component: () => import("@/views/auth/ResetPass.vue"),
        meta: {loginRequired: false}
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
                meta: {loginRequired: true}
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
                meta: {loginRequired: true}
            },
            {
                name: "roleSetting",
                path: "role",
                component: () => import("@/views/setting/role.vue"),
                meta: {loginRequired: true}
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {
    if (to.meta.loginRequired && !isLogin()) {
        return {name: "login"}
    }
})

export {router}
