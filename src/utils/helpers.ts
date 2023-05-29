import type {ServiceError} from "@/types/apiTypes";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {AxiosRequestConfig} from "axios";

export const showError = (error: ServiceError) => {
    ElMessage({type: "error", message: error.message})
}

function setToken(token: string) {
    localStorage.setItem("token", token)
}

function getToken() {
    return localStorage.getItem("token")
}

function removeToken(token: string) {
    localStorage.removeItem("token")
}

function addAuthHeader(config?: AxiosRequestConfig) {

    const token = getToken()
    const authConfig = config ?? {}

    if (authConfig.headers) {
        authConfig.headers.Authorization = token
    } else {
        authConfig.headers = {Authorization: token}
    }

    return authConfig
}

function handleTokenExpired(error: ServiceError) {
    const router = useRouter()
    // 如果token过期则跳转到首页
    if (error.code === "ERR_006") {
        router.push({name: 'login'}).catch()
    }
}
