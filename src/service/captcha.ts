import {request} from "@/utils/request";
import {ref} from "vue";
import {v4} from "uuid"

export default function useCaptcha() {
    const uuid = ref<string>()
    const captchaUrl = ref<string>()

    function refreshCaptcha() {
        uuid.value = v4()

        request.get("/captcha", {
            params: {uuid: uuid.value},
            responseType: "blob"
        }).then(blob => {
            captchaUrl.value = URL.createObjectURL(blob)
        }).catch(error => {
            console.log(error)
        })
    }

    refreshCaptcha()
    return {uuid, captchaUrl, refreshCaptcha}
}
