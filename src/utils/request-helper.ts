//@ts-ignore
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";
import {ActiveRequestConfig} from "@/utils/active-request.ts";
import {NormalizedResponseError} from "@/utils/request.ts";

const tokenScheme = "Bearer"

export function useRequestHelper(config: ActiveRequestConfig) {
    const router = useRouter()
    const authStore = useAuthStore()

    async function handleError(error: NormalizedResponseError) {
        const type = config?.errorType ?? "error"
        const message = config?.errorMessage ?? error.message
        const show = config?.showError ?? true

        switch (error.code) {
            case "ERR_006": // token过期或者解析失败
                await router.push({name: "login"})
                break
            case "ERR_008":
                ElMessage({type: "error", message: "Sorry，您没有执行该操作的权限！"})
                break
            default:
                if (show) {
                    ElMessage({type, message})
                }
        }
    }

    function getToken() {
        return `${tokenScheme} ${authStore.token}`
    }

    return {handleError, getToken}
}

