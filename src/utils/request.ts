import axios from 'axios'
import {useAuthStore} from "@/store/auth"
import {ElMessage} from "element-plus"
import {router} from "@/router"

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
    async error => {
        // 服务器有响应，此时error包含response属性
        if (error.response) {
            const authStore = useAuthStore()
            const statusCode = error.response.status

            // 如果token已存在，但是返回401，说明token已经过期，此时需要删除过期token并跳转到登录页面
            // 判断token是否存在是因为登陆时如果用户、密码或验证码错误时，后端api也会返回401，如果不做判断，此时也会触发
            if (authStore.accessToken && statusCode === 401) {
                // 非正常退出，保留当前路径，下次登入时直接跳转到该路径
                authStore.returnUrl = router.currentRoute.value.fullPath
                // 清空sessionStorage，并跳转到登陆页面
                await authStore.logout()

                ElMessage({
                    message: "Token已过期，请重新登录！",
                    type: "error"
                })
            } else if (statusCode === 403) {
                ElMessage({
                    message: "没有相应的权限，请联系管理员！",
                    type: "warning"
                })
            } else if (String(statusCode).startsWith('5')) {
                ElMessage({
                    message: "服务器错误，请联系管理员！",
                    type: "error"
                })
            } else if (statusCode === 422) {
                ElMessage({
                    message: "数据验证失败！",
                    type: "warning"
                })
                console.log(error.response.data)
            }
        } else if (error.request) {
            // 服务器无响应,此时error没有response属性，但包含request属性
            ElMessage({
                message: "服务器没有响应，请联系管理员！",
                type: "error"
            })
            console.log(error.request)
        } else {
            // request创建的时候就失败了，此时仅包含message属性
            console.log('setting up request error:', error.message)
        }

        return Promise.reject(error)
    }
)

export {$axios}
