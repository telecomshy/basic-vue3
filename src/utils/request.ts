import axios, {AxiosInstance, AxiosRequestConfig, isAxiosError} from "axios";
import {ElMessage} from "element-plus";

const baseURL = import.meta.env.VITE_BASE_URL
const timeout = import.meta.env.VITE_REQUEST_TIMEOUT

class Request {
    $axios: AxiosInstance

    constructor() {
        this.$axios = axios.create({
            baseURL,
            timeout,
            headers: {"content-type": "application/json"},
        })
    }

    async request(config: AxiosRequestConfig) {
        try {
            const response = await this.$axios.request(config)

            // 如果返回结果类型不为json，则原样返回
            if (config.responseType && config.responseType !== "json") {
                return Promise.resolve(response.data)
            } else {
                const {success, code, message, data} = response.data
                if (success) {
                    return Promise.resolve(data)
                } else {
                    return Promise.reject({code, message})
                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response) {
                    ElMessage({type: "error", message: "服务器内部错误"})
                    console.log(error.response)
                    console.log(error.response.statusText)
                    console.log(error.response.headers)
                } else if (error.request) {
                    ElMessage({type: "error", message: "未收到服务器响应"})
                    console.log(error.request)
                } else {
                    ElMessage({type: "error", message: "请求构筑失败"})
                    console.log(error.message)
                }
            }else{
                console.log("bug:", error)
            }
            return Promise.reject({code: "ERR_999", message: "网络故障或服务器内部错误"})
        }
    }

    async get(url: string, config?: AxiosRequestConfig) {
        try {
            return await this.request(Object.assign(config ?? {}, {url, method: 'get'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async post<D>(url: string, data?: D, config?: AxiosRequestConfig) {
        try {
            return await this.request(Object.assign(config ?? {}, {url, data, method: 'post'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const request = new Request()

export {request, Request}
