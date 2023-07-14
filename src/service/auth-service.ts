import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {onMounted, ref} from "vue";
import {Base64} from "js-base64";
import {v4} from "uuid";
//@ts-ignore
import {ElMessage} from "element-plus";
import {request} from "@/service/request-service.ts"

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

export function useLogin(url: string, loginData: LoginData) {
    const router = useRouter()
    const authStore = useAuthStore()
    const {responseData, post} = request.useActivePost<{ token: string }>(url, loginData)

    async function login() {
        try {
            await post()
            authStore.token = responseData.value.token
            await router.push({name: "index"})
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {login}
}


export function useRegister(url: string, registerData: RegisterData) {
    const router = useRouter()
    const {post} = request.useActivePost(url, registerData)

    async function register() {
        try {
            await post()
            await router.push({name: "index"})
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {register}
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
    const {get} = request.useActiveGet(url, {responseType: "blob"})

    async function refreshCaptcha() {
        uuid.value = v4()
        const captcha = await get<Blob>({uuid: uuid.value})
        captchaUrl.value = URL.createObjectURL(captcha)
    }

    onMounted(async () => {
        await refreshCaptcha()
    })

    return {uuid, captchaUrl, refreshCaptcha}
}
