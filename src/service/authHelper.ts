import {requestApi} from '@/utils/requestApi';
import {AxiosRequestConfig} from "axios";
import {useRouter} from "vue-router";
import {ServiceError} from "@/types/apiTypes";
import {Base64} from "js-base64";
import {ref} from "vue";
import {v4} from "uuid";

interface LoginInfo {
    username: string,
    password: string
}

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


// function setToken(token: string) {
//     localStorage.setItem("token", token)
// }
//
// function getToken() {
//     return localStorage.getItem("token")
// }
//
// function removeToken(token: string) {
//     localStorage.removeItem("token")
// }

export function useRememberLoginInfo() {
    const savedUsername = ref<string>("")
    const savedPassword = ref<string>("")
    const rememberState = ref<boolean>(false)

    const loginInfo = localStorage.getItem("loginInfo")

    if (loginInfo) {
        const {username, password, remember} = JSON.parse(loginInfo)
        savedUsername.value = username
        savedPassword.value = Base64.decode(password)
        rememberState.value = remember
    }

    function onSaveLoginInfo() {
        const loginInfo = {
            username: savedUsername.value,
            password: Base64.encode(savedPassword.value),
            remember: rememberState.value
        }
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo))
    }

    function onRemoveLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    return {savedUsername, savedPassword, rememberState, onSaveLoginInfo, onRemoveLoginInfo}
}


export function useCaptcha() {
    const uuid = ref<string>()
    const captchaUrl = ref<string>()

    function onRefreshCaptcha() {
        uuid.value = v4()

        requestApi.get("/captcha", {
            params: {uuid: uuid.value},
            responseType: "blob"
        }).then(blob => {
            captchaUrl.value = URL.createObjectURL(blob)
        }).catch(error => {
            console.log(error)
        })
    }

    onRefreshCaptcha()
    return {uuid, captchaUrl, onRefreshCaptcha}
}

export function useLogin(loginData: LoginData) {
    const router = useRouter()
    const error = ref<ServiceError>()

    requestApi.post("/login", loginData).then(token => {
        // setToken(token)
        router.push({name: "index"}).catch()
    }).catch(err => {
        error.value = err
    })

    return {error}
}


// export default function useAuth() {

    // const router = useRouter()

    // function addAuthHeader(config?: AxiosRequestConfig) {
    //
    //     const token = getToken()
    //     const authConfig = config ?? {}
    //
    //     if (authConfig.headers) {
    //         authConfig.headers[authorizationKey] = token
    //     } else {
    //         authConfig.headers = {[authorizationKey]: token}
    //     }
    //
    //     return authConfig
    // }
    //
    // async function handleTokenExpired(error: ServiceError) {
    //     const router = useRouter()
    //     // 如果token过期则跳转到首页
    //     if (error.code === "ERR_006") {
    //         await router.push({name: 'login'})
    //     }
    // }

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
//     function getToken() {
//         return localStorage.getItem("token")
//     }
//
//     function setToken(token: string) {
//         localStorage.setItem("token", token)
//     }
//
//     function removeToken() {
//         localStorage.removeItem("token")
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
