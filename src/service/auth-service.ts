import {RouteLocationRaw, useRouter} from "vue-router";
import {AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";
import {request, NormalizedResponseError} from "@/utils/request";

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
const tokenScheme = "Bearer"

export function useAuthService() {
    const router = useRouter()
    const authStore = useAuthStore()

    function getToken() {
        return authStore.authData.token
    }

    async function login(url: string, loginData: LoginData, indexUrl: RouteLocationRaw) {
        try {
            const data = await request.post(url, loginData)
            authStore.authData = data
            await router.push(indexUrl)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async function logout() {
        // 如果pinia使用setup语法，调用$reset会报错
        authStore.$reset()
        await router.push({name: "login"})
    }

    async function register(url: string, registerData: RegisterData, loginUrl?: RouteLocationRaw) {
        try {
            const data = await request.post(url, registerData)
            if (loginUrl) {
                await router.push(loginUrl)
            }
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    function addAuthHeader(config?: AxiosRequestConfig) {
        const token = `${tokenScheme} ${getToken()}`
        const authConfig = config ?? {}

        if (authConfig.headers) {
            authConfig.headers[authorizationKey] = token
        } else {
            authConfig.headers = {[authorizationKey]: token}
        }

        return authConfig
    }

    async function handleTokenExpired(error: NormalizedResponseError) {
        // 如果token过期则跳转到首页
        if (error.code === "ERR_006") {
            await router.push({name: "login"})
        }
    }

    async function authGet(url: string, config?: AxiosRequestConfig) {
        try {
            return await request.get(url, addAuthHeader(config))
        } catch (error) {
            await handleTokenExpired(error as NormalizedResponseError)
            return Promise.reject(error)
        }
    }

    async function authPost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
        try {
            return await request.post(url, data, addAuthHeader(config))
        } catch (error) {
            await handleTokenExpired(error as NormalizedResponseError)
            return Promise.reject(error)
        }
    }

    return {login, logout, register, authGet, authPost}
}
