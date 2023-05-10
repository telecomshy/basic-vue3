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
            // 后端返回错误应尽可能包含reason字段，说明错误原因
            error.detail = data.detail ?? statusText

            if (status === 401) {
                const currentPath = router.currentRoute.value.fullPath

                // 如果当前非登录页面，说明token过期
                if (!currentPath.includes('login')) {
                    // 保留当前路径，下次登入时直接跳转到该路径
                    authStore.returnUrl = currentPath
                    // 清空sessionStorage，并跳转到登陆页面
                    await authStore.logout()
                }
            }
            if (status === 422) {
                // fastapi的422错误一般是由pydantic进行数据验证时自动抛出，且有统一格式，所以统一处理为请求数据不合法
                error.detail = "请求数据不合法"
            }
            if (status === 500) {
                error.detail = "服务器内部错误"
            }
            console.log(error.response)
        } else if (error.request) {
            // 1. 服务器内部错误或者网络故障,此时error没有response属性，但包含request属性
            // 2. 现代浏览器cors策略，如果后端内部错误，不会设置响应头Access-Control-Allow-Origin，
            //    此时浏览器不会提供响应给用户代码，此时response为空，message为Network Error
            error.reason = "网络问题或服务器内部错误"
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
    detail: String
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
