import axios, {AxiosInstance, AxiosRequestConfig, isAxiosError} from "axios";
import {ref} from "vue";
import {ServiceError} from "@/types/api-types";

const baseURL = import.meta.env.VITE_BASE_URL
const timeout = import.meta.env.VITE_REQUEST_TIMEOUT

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
            }
            return Promise.reject({code: "ERR_999", message: "网络故障或服务器内部错误"})
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

export {request}

// const baseURL = import.meta.env.VITE_BASE_URL
// const timeout = import.meta.env.VITE_REQUEST_TIMEOUT
//
// const $axios = axios.create({
//     baseURL,
//     timeout,
//     headers: {"content-type": "application/json"},
// })
//
// function useRequest(config: AxiosRequestConfig) {
//     // request执行后会立即返回，当返回的时候，data和error的value都还是null
//     // 当request回调执行完毕，data和error的value才被赋值，所以要非常小心
//
//     const data = ref()
//     const error = ref<ServiceError>()
//
//     $axios.request(config).then(response => {
//         if (config.responseType && config.responseType !== "json") {
//             data.value = response.data
//         } else {
//             const {success, code, message, data: result} = response.data
//             if (success) {
//                 data.value = result
//             } else {
//                 error.value = {code, message}
//             }
//         }
//     }).catch(err => {
//         if (isAxiosError(err)) {
//             if (err.response) {
//                 console.log("error response:", err.response)
//             } else if (err.request) {
//                 console.log("error request:", err.request)
//             } else {
//                 console.log("error message:", err.message)
//             }
//         } else {
//             console.log("program bug:", err)
//         }
//         error.value = {code: "ERR_999", message: "网络故障或服务器内部错误"}
//     })
//
//     return {data, error}
// }
//
// export function useGet(url: string, config?: AxiosRequestConfig) {
//     return useRequest(Object.assign(config ?? {}, {url, method: 'get'}))
// }
//
//
// export function usePost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
//     return useRequest(Object.assign(config ?? {}, {url, data, method: 'post'}))
// }
