import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import {useAuthStore} from "@/store/auth"
import {router} from "@/router"
import {debounce} from "lodash-es"

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8"

const $axios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 120000
})

$axios.interceptors.request.use(
    config => {
        const authStore = useAuthStore()
        const accessToken = authStore.accessToken
        // 先检查token是否存在，这样在登陆的时候就不会添加header头
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken
        }
        return config
    }
)

$axios.interceptors.response.use(
    undefined,
    async (error) => {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了2xx的范围，此时error包含response属性
        if (error.response) {
            const authStore = useAuthStore()
            const {status, statusText, data} = error.response
            error.reason = statusText

            if (status === 401) {
                const currentPath = router.currentRoute.value.fullPath

                // 如果当前非登录页面，说明token过期
                if (!currentPath.includes('login')) {
                    // 保留当前路径，下次登入时直接跳转到该路径
                    authStore.returnUrl = currentPath
                    // 清空sessionStorage，并跳转到登陆页面
                    await authStore.logout()
                }
                // 不论token过期或者登录失败，后端应返回401错误，并将失败原因保存在detail字段中
                error.reason = data.detail
            } else if (status === 403) {
                error.reason = "没有相应的权限"
            } else if (String(status).startsWith('5')) {
                error.reason = "服务器内部错误"
            } else if (status === 422) {
                error.reason = "请求数据不合法"
                console.log(data.detail)
            }
            console.log(error.response)
        } else if (error.request) {
            // 服务器无响应,此时error没有response属性，但包含request属性
            error.reason = "服务器无响应"
            console.log(error.request)
        } else {
            // 发送请求时出了点问题,此时只有error.message属性
            error.reason = "请求构建失败"
            console.log(error.message)
        }

        return Promise.reject(error)
    }
)

interface RequestApiError extends AxiosError {
    reason: String
}

// 如果使用回调的方式，则success回调里的其它异常也会传递到error的回调函数
async function _request(config: AxiosRequestConfig): Promise<[undefined, AxiosResponse] | [RequestApiError]> {
    try {
        const response = await $axios(config)
        return [undefined, response]
    } catch (error) {
        return [error as RequestApiError]
    }
}

// request全局防抖
const requestApi = debounce(
    _request,
    import.meta.env.VITE_DEBOUNCE_DELAY,
    {
        'leading': true,
        'trailing': false
    }
)

export {$axios, requestApi}
