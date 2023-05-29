import axios, {AxiosInstance, AxiosRequestConfig, isAxiosError} from "axios";

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
                    console.log("error response:", error.response)
                } else if (error.request) {
                    console.log("error request:", error.request)
                } else {
                    console.log("error message:", error.message)
                }
            } else {
                console.log("program bug:", error)
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

const requestApi = new Request()

export {requestApi}
