import {defineStore} from "pinia";
import {requestApi} from "@/utils/request";
import {router} from "@/router"
import {ElMessage} from "element-plus";

interface AuthState {
    username: string | null,
    accessToken: string | null,
    returnUrl: null | string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => {
        return {
            username: sessionStorage.getItem("username"),
            accessToken: sessionStorage.getItem("accessToken"),
            returnUrl: null
        }
    },
    actions: {
        async login(authForm: Object) {
            const [error, response] = await requestApi(
                {
                    method: "post",
                    url: "/login",
                    data: authForm,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            )

            if (error) {
                ElMessage({message: `登录失败：${error.reason}`, type: "error"})
            } else {
                const {access_token: accessToken, username} = response.data

                this.accessToken = accessToken
                this.username = username

                sessionStorage.setItem("accessToken", accessToken)
                sessionStorage.setItem("username", username)

                await router.push(this.returnUrl ?? {name: "index"})
                // 登录以后，清空之前异常退出时保留的路径
                this.returnUrl = null
            }
        },
        async logout() {
            this.accessToken = null
            this.username = null
            // 正常退出时，清空之前异常退出时保留的路径，如果login时已经清空，这里可以不再清空
            this.returnUrl = null

            sessionStorage.removeItem("accessToken")
            sessionStorage.removeItem("username")

            await router.push({name: "login"})
        }
    }
})
