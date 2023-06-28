import {RouteLocationRaw, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {request} from "@/utils/request";
import {onMounted, ref, Ref} from "vue";
import {Base64} from "js-base64";
import {v4} from "uuid";

interface LoginData {
    username: string | Ref,
    password: string | Ref,
    uuid: string | Ref,
    captcha: string | Ref
}

interface RegisterData {
    username: string,
    password1: string,
    password2: string
}


export function useLogin(loginUrl: string, indexUrl: RouteLocationRaw) {
    const router = useRouter()
    const authStore = useAuthStore()

    const loginData = ref<LoginData>({
        username: "",
        password: "",
        uuid: "",
        captcha: ""
    })

    async function login() {
        try {
            const data = await request.post(loginUrl, loginData.value)
            authStore.authData = data
            await router.push(indexUrl)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {loginData, login}
}


export function useRegister(registerUrl: string, loginUrl?: RouteLocationRaw) {
    const router = useRouter()
    const registerData = ref<RegisterData>({
        username: "",
        password1: "",
        password2: ""
    })

    async function register() {
        try {
            const data = await request.post(registerUrl, registerData.value)
            if (loginUrl) {
                await router.push(loginUrl)
            }
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {registerData, register}
}


export function useLogout() {
    const authStore = useAuthStore()
    const router = useRouter()

    async function logout() {
        // 如果pinia使用setup语法，调用$reset会报错
        authStore.$reset()
        await router.push({name: "login"})
    }

    return {logout}
}


export function useRememberLoginInfo() {
    const savedUsername = ref<string>("")
    const savedPassword = ref<string>("")
    const remember = ref<boolean>(false)

    const loginInfo = localStorage.getItem("loginInfo")

    if (loginInfo) {
        const {username, password, rememberInfo} = JSON.parse(loginInfo)
        savedUsername.value = username
        savedPassword.value = Base64.decode(password ?? "")
        remember.value = rememberInfo
    }

    function saveLoginInfo() {
        const loginInfo = {
            username: savedUsername.value,
            password: Base64.encode(savedPassword.value),
            rememberInfo: remember.value
        }
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo))
    }

    function removeLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    return {savedUsername, savedPassword, remember, saveLoginInfo, removeLoginInfo}
}


export function useCaptcha(url: string) {
    const uuid = ref<string>("")
    const captchaUrl = ref<string>("")

    async function refreshCaptcha() {
        uuid.value = v4()

        try {
            const blob = await request.get(url, {
                params: {uuid: uuid.value},
                responseType: "blob"
            })
            captchaUrl.value = URL.createObjectURL(blob)
        } catch (error) {
            console.log(error)
        }
    }

    onMounted(async () => {
        await refreshCaptcha()
    })

    return {uuid, captchaUrl, refreshCaptcha}
}
