import {useAuthStore} from "@/stores/auth.ts";
import {AxiosResponse, isAxiosError} from "axios";
import {useRouter} from "vue-router";
//@ts-ignore
import {ElMessage} from "element-plus";
import {ActiveRequestConfig, ActiveRequest} from "@/utils/request.ts";

const baseURL = import.meta.env.VITE_BASE_URL
const timeout = import.meta.env.VITE_REQUEST_TIMEOUT

function useToken() {
    const authStore = useAuthStore()
    return `Bearer ${authStore.token}`
}

interface ActiveRequestWithErrorConfig extends ActiveRequestConfig {
    showError?: boolean;
    errorType?: 'error' | 'warn' | 'info';
}

class ServiceError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)
        this.code = code
    }
}

const useResponseHandler = () => {
    async function responseHandler(response: AxiosResponse, config: ActiveRequestWithErrorConfig) {
        const responseType = config.responseType ?? 'json'

        if (responseType === 'json') {
            const {success, code, message, data} = response.data
            if (success) {
                return data
            } else {
                throw new ServiceError(code, message)
            }
        } else {
            return response.data
        }
    }

    return {responseHandler}
}

const useErrorHandler = () => {
    const router = useRouter()

    async function errorHandler(error: any, config: ActiveRequestWithErrorConfig) {
        const showError = config.showError ?? true
        const errorType = config.errorType ?? "error"
        let errorMessage: string | null = null

        if (error instanceof ServiceError) {
            switch (error.code) {
                case "ERR_006": // token过期或者解析失败
                    await router.push({name: "login"})
                    break
                case "ERR_008":
                    errorMessage = "Sorry，您没有执行该操作的权限！"
                    break
                default:
                    errorMessage = error.message
            }
        }

        if (isAxiosError(error)) {
            errorMessage = "网络故障或服务器内部错误"
        }

        if (showError && errorMessage) {
            ElMessage({type: errorType, message: errorMessage})
        }
    }

    return {errorHandler}
}

const baseConfig = {
    baseURL,
    timeout,
    headers: {"content-type": "application/json"},
    useResponseHandler,
    useErrorHandler
}

export const request = new ActiveRequest(baseConfig)

export const authRequest = new ActiveRequest({
    useToken,
    ...baseConfig
})
