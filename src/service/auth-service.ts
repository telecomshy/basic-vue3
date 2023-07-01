import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {request} from "@/utils/request";
import {onMounted, ref} from "vue";
import {Base64} from "js-base64";
import {v4} from "uuid";
//@ts-ignore
import {ElMessage} from "element-plus";
import {useActivePost} from "@/utils/active-request.ts";

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

interface LoginResponseData {
    username: string,
    token: string,
    scopes: string[]
}

export function useLogin(url: string, loginData: LoginData) {
    const router = useRouter()
    const authStore = useAuthStore()
    const {responseData, activePost} = useActivePost<LoginResponseData>(url, loginData)

    async function login() {
        try {
            await activePost()
            authStore.authData = responseData.value
            await router.push({name: "index"})
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {login}
}


export function useRegister(url: string, registerData: RegisterData) {
    const router = useRouter()
    const {activePost} = useActivePost(url, registerData)

    async function register() {
        try {
            await activePost()
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

    async function refreshCaptcha() {
        uuid.value = v4()

        try {
            const blob: Blob = await request.get(url, {
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
