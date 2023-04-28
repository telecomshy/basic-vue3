import axios, {AxiosRequestConfig} from 'axios'
import {useAuthStore} from "@/store/auth"
import {ElMessage} from "element-plus"
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

//TODO 加入防抖动处理
$axios.interceptors.response.use(
    undefined,
    async (error) => {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了2xx的范围，此时error包含response属性
        if (error.response) {
            const authStore = useAuthStore()
            const {status, data} = error.response

            if (status === 401) {
                const currentPath = router.currentRoute.value.path

                if (currentPath.includes('login')) {
                    ElMessage({message: data.detail, type: "error"})
                } else {
                    // 非正常退出，保留当前路径，下次登入时直接跳转到该路径
                    authStore.returnUrl = router.currentRoute.value.fullPath
                    // 清空sessionStorage，并跳转到登陆页面
                    await authStore.logout()
                    ElMessage({message: "Token已过期，请重新登录！", type: "error"})
                }
            } else if (status === 403) {
                ElMessage({message: "没有相应的权限！", type: "warning"})
            } else if (String(status).startsWith('5')) {
                ElMessage({message: "服务器内部错误！", type: "error"})
            } else if (status === 422) {
                ElMessage({message: "数据验证失败！", type: "error"})
            }
            console.log(error.response)
        } else if (error.request) {
            // 服务器无响应,此时error没有response属性，但包含request属性
            ElMessage({message: "服务器无响应！", type: "error"})
            console.log(error.request)
        } else {
            // 发送请求时出了点问题,此时只有error.message属性
            ElMessage({message: "客户端请求错误！", type: "error"})
            console.log(error.message)
        }
        return Promise.reject(error)
    }
)

function _request(config: AxiosRequestConfig) {
    return $axios(config)
        .then((response) => [null, response])
        .catch(error => [error])
}

// request全局防抖
const request = debounce(
    _request,
    import.meta.env.VITE_DEBOUNCE_DELAY,
    {
        'leading': true,
        'trailing': false
    }
)

export {$axios, request}
