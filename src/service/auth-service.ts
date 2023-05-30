import {useRouter} from "vue-router";
import {ServiceError} from "@/types/api-types";
import {AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";
import {request} from "@/utils/request";

interface LoginData {
    username: string,
    password: string,
    uuid: string,
    captcha: string
}

interface RegisterData {
    username: string,
    password1: string,
    password2: string
}

const authorizationKey = "Authorization"

function getToken() {
    return localStorage.getItem("token")
}

function setToken(token: string) {
    localStorage.setItem("token", token)
}

function removeToken() {
    localStorage.removeItem("token")
}

function addAuthHeader(config?: AxiosRequestConfig) {

    const token = getToken()
    const authConfig = config ?? {}

    if (authConfig.headers) {
        authConfig.headers[authorizationKey] = token
    } else {
        authConfig.headers = {[authorizationKey]: token}
    }

    return authConfig
}

export function useAuthService() {
    const router = useRouter()
    const authStore = useAuthStore()

    async function login(loginData: LoginData) {
        try {
            const token = await request.post("/login", loginData)
            authStore.isLogin = true
            setToken(token)
            await router.push({name: "index"})
        } catch (error) {
            console.log(error)
            return Promise.reject(error)
        }
    }

    async function logout() {
        authStore.isLogin = false
        removeToken()
        await router.push({path: "/login"})
    }

    async function register(registerData: RegisterData) {
        try {
            await request.post("/register", registerData)
            await router.push("/login")
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async function handleTokenExpired(error: ServiceError) {
        // 如果token过期则跳转到首页
        if (error.code === "ERR_006") {
            await router.push({path: '/login'})
        }
    }

    async function authGet(url: string, config?: AxiosRequestConfig) {
        try {
            return await request.get(url, addAuthHeader(config))
        } catch (error) {
            await handleTokenExpired(error as ServiceError)
            return Promise.reject(error)
        }
    }

    async function authPost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
        try {
            return await request.post(url, data, addAuthHeader(config))
        } catch (error) {
            await handleTokenExpired(error as ServiceError)
            return Promise.reject(error)
        }
    }

    return {login, logout, register, authGet, authPost}
}
