import axios, {AxiosInstance, AxiosRequestConfig, isAxiosError} from "axios";

const baseURL = import.meta.env.VITE_BASE_URL
const timeout = import.meta.env.VITE_REQUEST_TIMEOUT

class NormalizedResponseError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)
        this.code = code
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

    async requestApi<R>(config: AxiosRequestConfig): Promise<R> {
        try {
            const response = await this.$axios.request(config)
            if (config.responseType && config.responseType !== "json") {
                return Promise.resolve(response.data)
            } else {
                const {success, code, message, data} = response.data
                if (success) {
                    return Promise.resolve(data)
                } else {
                    // 不能直接throw error,throw的话会被下面的catch捕获，而不是被外层的catch捕获
                    return Promise.reject(new NormalizedResponseError(code, message))
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
            }
            return Promise.reject(new NormalizedResponseError("ERR_999", "网络故障或服务器内部错误"))
        }
    }

    async get<R>(url: string, config: AxiosRequestConfig) {
        try {
            return await this.requestApi<R>(Object.assign(config ?? {}, {url, method: 'get'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async post<R>(url: string, data?: any, config?: AxiosRequestConfig) {
        try {
            return await this.requestApi<R>(Object.assign(config ?? {}, {url, data, method: 'post'}))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const request = new Request()

export {request, NormalizedResponseError}
