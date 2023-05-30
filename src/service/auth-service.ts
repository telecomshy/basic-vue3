import {useRouter} from "vue-router";
import {ServiceError} from "@/types/api-types";
import {ref, watch, watchEffect} from "vue";
import {ElMessage} from "element-plus";
import {AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";
import {request} from "@/utils/request";

interface LoginData {
    username: string,
    password: string,
    uuid: string,
    captcha: string
}

interface RegisterData {
    username: string,
    password1: string,
    password2: string
}


function setToken(token: string) {
    localStorage.setItem("token", token)
}

function getToken() {
    return localStorage.getItem("token")
}

function removeToken(token: string) {
    localStorage.removeItem("token")
}

function addAuthHeader(config?: AxiosRequestConfig, authorizationKey: string = "Authorization") {

    const token = getToken()
    const authConfig = config ?? {}

    if (authConfig.headers) {
        authConfig.headers[authorizationKey] = token
    } else {
        authConfig.headers = {[authorizationKey]: token}
    }

    return authConfig
}

export function useAuthService() {
    const router = useRouter()
    const authStore = useAuthStore()

    async function login(loginData: LoginData, loginUrl: string = "/login", indexUrl: string = "/index") {
        try {
            const token = await request.post(loginUrl, loginData)
            authStore.isLogin = true
            localStorage.setItem("token", token)
            await router.push({path: indexUrl})
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {login}
}

// function handleTokenExpired(error: ServiceError) {
//     const router = useRouter()
//     // 如果token过期则跳转到首页
//     if (error.code === "ERR_006") {
//         router.push({name: 'login'}).catch()
//     }
// }

// export function useAuthState() {
//     const authStore = useAuthStore()
//
//     function setLoginState(token: string) {
//         authStore.isLogin = true
//         localStorage.setItem("token", token)
//     }
//
//     function setLogoutState() {
//         authStore.isLogin = false
//         localStorage.removeItem("token")
//     }
//
//     return {isLogin: authStore.isLogin, setLoginState, setLogoutState}
// }
//
// export function useLogin(loginData: LoginData, loginUrl: string = "/login", indexUrl: string = "/index") {
//     const router = useRouter()
//     const {setLoginState} = useAuthState()
//
//     const {data, error} = usePost(loginUrl, loginData)
//
//     watch(data, () => {
//         alert("login")
//         router.push({path: indexUrl})
//     })
//
//     // watch(error, err => {
//     //     console.log(error.value?.message)
//     // })
//
//     // if (error.value) {
//     //     console.log(error.value)
//     // } else {
//     //     setLoginState(data.value)
//     //     router.push({path: indexUrl}).catch()
//     // }
//
//     return {data, error}
// }


// export default function useAuth() {

// const router = useRouter()

//     async function authPost<D>(url: string, data?: D, config?: AxiosRequestConfig) {
//         try {
//             return await requestApi.post<D>(url, data, addAuthHeader(config))
//         } catch (error) {
//             await handleTokenExpired(error as ServiceError)
//             return Promise.reject(error)
//         }
//     }
//
//     async function authGet(url: string, config?: AxiosRequestConfig) {
//         try {
//             return await requestApi.get(url, addAuthHeader(config))
//         } catch (error) {
//             await handleTokenExpired(error as ServiceError)
//             return Promise.reject(error)
//         }
//     }
//
//     async function logout() {
//         const router = useRouter()
//         removeToken()
//         await router.push({name: "login"})
//     }
//
//     function isLogin() {
//         return !!getToken();
//     }
//
//     async function register(registerData: RegisterData) {
//         try {
//             await requestApi.post("/register", registerData)
//         } catch (error) {
//             return Promise.reject(error)
//         }
//     }
//
//     async function getUserScopes(): Promise<string[]> {
//         try {
//             return await authGet("/scopes")
//         } catch (error) {
//             return Promise.reject(error)
//         }
//     }
//
//     return {logout, isLogin, register, getUserScopes}
// }
