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
    const savedLoginInfo = {
        username: ref<string>(""),
        password: ref<string>(""),
    }

    const rememberState = ref(false)

    const savedString = localStorage.getItem("loginInfo")

    if (savedString) {
        const {username, password, remember} = JSON.parse(savedString)
        savedLoginInfo.username.value = username
        savedLoginInfo.password.value = Base64.decode(password)
        rememberState.value = remember
    }

    function saveLoginInfo() {
        localStorage.setItem("loginInfo", JSON.stringify({
            username: savedLoginInfo.username.value,
            password: Base64.encode(savedLoginInfo.password.value),
            remember: rememberState.value
        }))
    }

    function removeLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    return {savedLoginInfo, rememberState, saveLoginInfo, removeLoginInfo}
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
