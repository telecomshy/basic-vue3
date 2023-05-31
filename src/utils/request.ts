import axios, {AxiosInstance, AxiosRequestConfig, isAxiosError} from "axios";
import {ElMessage} from "element-plus";

const baseURL = import.meta.env.VITE_BASE_URL
const timeout = import.meta.env.VITE_REQUEST_TIMEOUT

class ResponseServiceError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)
        this.code = code
    }
}

function handleServiceError(error: unknown, errCallback?: (error: ResponseServiceError) => void) {
    if (error instanceof ResponseServiceError) {
        if (errCallback) errCallback(error)
    } else {
        console.log("unexpected error:", error)
    }
}

class Request {
    private $axios: AxiosInstance;

    constructor() {
        this.$axios = axios.create({
            baseURL,
            timeout,
            headers: {"content-type": "application/json"},
        })
    }

    async requestApi(config: AxiosRequestConfig) {
        try {
            const response = await this.$axios.request(config)
            if (config.responseType && config.responseType !== "json") {
                return Promise.resolve(response.data)
            } else {
                const {success, code, message, data} = response.data
                if (success) {
                    return Promise.resolve(data)
                } else {
                    return Promise.reject(new ResponseServiceError(code, message))
                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response) {
                    console.log("error response:", error.response)
                } else if (error.request) {
                    console.log("error request:", error.request)
                } else {
                    console.log("error message:", error.message)
                }
                ElMessage.error("网络故障或服务器内部错误")
            } else {
                console.log("unexpected error:", error)
            }
        }
    }

    async get(url: string, config: AxiosRequestConfig) {
        try {
            return await this.requestApi(Object.assign(config ?? {}, {url, method: 'get'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async post<D>(url: string, data?: D, config?: AxiosRequestConfig) {
        try {
            return await this.requestApi(Object.assign(config ?? {}, {url, data, method: 'post'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const request = new Request()

export {request, ResponseServiceError, handleServiceError}