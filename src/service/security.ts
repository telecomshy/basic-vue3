import {request} from '@/utils/request';
import {AxiosRequestConfig} from "axios";
import {useRouter} from "vue-router";
import {ServiceError} from "@/types/apiTypes";
import {Base64} from "js-base64";


const tokenPrefix = "bearer "
const authorizationKey = "Authorization"
const router = useRouter()

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

function createAuthHeader(config?: AxiosRequestConfig) {

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

async function authPost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
    try {
        return await request.post<D>(url, data, createAuthHeader(config))
    } catch (error) {
        await handleTokenExpired(error as ServiceError)
        return Promise.reject(error)
    }
}

async function authGet(url: string, config?: AxiosRequestConfig) {
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

async function getCaptcha(uuid: string) {
    try {
        return await request.get("/captcha", {
            params: {uuid},
            responseType: "blob"
        })
    } catch (error) {
        console.log("get captcha error", error)
        return Promise.reject(error)
    }
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

async function register(registerData: RegisterData){
    try{
        await request.post("/register", registerData)
    }catch(error){
        return Promise.reject(error)
    }
}

export default function useSecurity() {
    return {login, logout, getCaptcha, isLogin, getLoginInfo, saveLoginInfo, removeLoginInfo, register}
}
