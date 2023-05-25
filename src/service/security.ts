import {request} from '@/utils/request';
import {AxiosRequestConfig} from "axios";
import {RouteRecordRaw, useRouter} from "vue-router";
import {ServiceError} from "@/types/apiTypes";
import {Base64} from "js-base64";
import {v4 as uuidv4} from "uuid"


const tokenPrefix = "bearer "
const authorizationKey = "Authorization"
const router = useRouter()

interface RequestConfig extends AxiosRequestConfig {
    redirect?: boolean
    redirectRoute?: RouteRecordRaw  // 如果出现token过期错误，跳转页面
}


function createAuthHeader(config?: RequestConfig) {

    const token = tokenPrefix + getToken()
    const authConfig = config ?? {}

    if (authConfig.headers) {
        authConfig.headers[authorizationKey] = token
    } else {
        authConfig.headers = {[authorizationKey]: token}
    }

    return authConfig
}


async function handleTokenExpired(error: ServiceError) {
    // 如果token过期则跳转到首页
    if (error.code === "ERR_006") {
        await router.push({name: 'login'})
    }
}

async function authPost<D>(url: string, data?: D, config?: RequestConfig) {
    try {
        return await request.post<D>(url, data, createAuthHeader(config))
    } catch (error) {
        await handleTokenExpired(error as ServiceError)
        return Promise.reject(error)
    }
}

async function authGet(url: string, config?: RequestConfig) {
    try {
        return await request.get(url, createAuthHeader(config))
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

interface LoginData {
    username: string,
    password: string,
    uuid: string,
    captcha: string
}

async function login(loginData: LoginData) {
    try {
        const token = await request.post("/login", loginData)
        setToken(token)
    } catch (error) {
        return Promise.reject(error)
    }
}

async function logout() {
    removeToken()
    await router.push({name: "login"})
}

async function getCaptcha() {
    try {
        return await request.get("/captcha", {
            params: uuidv4(),
            responseType: "blob"
        })
    } catch (error) {
        return Promise.reject(error)
    }
}

function isLogin() {
    return !!getToken();
}

interface LoginInfo {
    username: string,
    password: string
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

export default function useSecurity() {
    return {login, logout, authGet, authPost, getCaptcha, isLogin, getLoginInfo, saveLoginInfo, removeLoginInfo}
}
