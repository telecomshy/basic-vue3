import {request} from '@/utils/request';
import {AxiosRequestConfig} from "axios";
import {useRouter} from "vue-router";
import {ServiceError} from "@/types/apiTypes";
import {Base64} from "js-base64";
import {reactive, ref} from "vue";

const authorizationKey = "Authorization"

interface LoginInfo {
    username: string,
    password: string
}

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


export default function useSecurity() {

    const router = useRouter()
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

    async function handleTokenExpired(error: ServiceError) {
        const router = useRouter()
        // 如果token过期则跳转到首页
        if (error.code === "ERR_006") {
            await router.push({name: 'login'})
        }
    }

    async function authPost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
        try {
            return await request.post<D>(url, data, addAuthHeader(config))
        } catch (error) {
            await handleTokenExpired(error as ServiceError)
            return Promise.reject(error)
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

    function getToken() {
        return localStorage.getItem("token")
    }

    function setToken(token: string) {
        localStorage.setItem("token", token)
    }

    function removeToken() {
        localStorage.removeItem("token")
    }

    async function login(loginData: LoginData) {
        try {
            const token = await request.post("/login", loginData)
            setToken(token)
            await router.push({name: "index"})
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async function logout() {
        const router = useRouter()
        removeToken()
        await router.push({name: "login"})
    }

    function isLogin() {
        return !!getToken();
    }

    function getLoginInfo(): LoginInfo | undefined {
        const loginInfoString = localStorage.getItem("loginInfo")

        if (loginInfoString) {
            const loginInfo = JSON.parse(loginInfoString)
            return {
                username: loginInfo.username,
                password: Base64.decode(loginInfo.password)
            }
        }
    }

    function saveLoginInfo(loginInfo: LoginInfo) {
        loginInfo.password = Base64.encode(loginInfo.password)
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo))
    }

    function removeLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    async function register(registerData: RegisterData) {
        try {
            await request.post("/register", registerData)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async function getUserScopes(): Promise<string[]> {
        try {
            return await authGet("/scopes")
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {login, logout, isLogin, getLoginInfo, saveLoginInfo, removeLoginInfo, register, getUserScopes}
}
