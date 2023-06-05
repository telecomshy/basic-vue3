import {request} from '@/utils/request';
import {Base64} from "js-base64";
import {onMounted, ref} from "vue";
import {v4} from "uuid";

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

    // return {savedUsername, savedPassword, rememberState, saveLoginInfo, removeLoginInfo}
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
