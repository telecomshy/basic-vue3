import {useRouter} from "vue-router";
import {AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";
import {NormalizedResponseError, request} from "@/utils/request";
import {onMounted, ref, Ref, toValue, watch, WatchOptions, WatchSource} from "vue";

const authorizationKey = "Authorization"
const tokenScheme = "Bearer"

export function useAuthHelper() {
    const router = useRouter()
    const authStore = useAuthStore()

    function getToken() {
        return authStore.authData.token
    }

    function addAuthHeader(config?: AxiosRequestConfig) {
        const token = `${tokenScheme} ${getToken()}`
        const authConfig = config ?? {}

        if (authConfig.headers) {
            authConfig.headers[authorizationKey] = token
        } else {
            authConfig.headers = {[authorizationKey]: token}
        }

        return authConfig
    }

    async function handleKnownError(error: NormalizedResponseError) {
        // 错误处理以后，仍然向上抛出，最终由全局错误处理器捕获
        if (error.code === "ERR_006") {
            await router.push({name: "login"})
        }
        return Promise.reject(error)
    }

    // TODO 待删除，可用useAuthGet代替
    // async function authGetRequest(url: string, config?: AxiosRequestConfig) {
    //     try {
    //         return await request.get(url, addAuthHeader(config))
    //     } catch (error) {
    //         return await handleKnownError(error as NormalizedResponseError)
    //     }
    // }

    // TODO 待删除，可用useAuthPost代替
    // async function authPostRequest<D>(url: string, data?: D, config?: AxiosRequestConfig) {
    //     try {
    //         return await request.post(url, data, addAuthHeader(config))
    //     } catch (error) {
    //         return await handleKnownError(error as NormalizedResponseError)
    //     }
    // }

    return {addAuthHeader, handleKnownError}
}


interface authRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean,
    watchSources?: WatchSource,
    watchOptions?: WatchOptions
}

export function useAuthRequest<R>(config?: authRequestConfig) {
    const {addAuthHeader, handleKnownError} = useAuthHelper()
    const responseData = ref()

    async function authRequest(data?: any) {
        if (data !== undefined) {
            if (config?.method === 'post') {
                Object.assign(config ?? {}, {data})
            }else if (config?.method === 'get') {
                Object.assign(config ?? {}, {params: data})
            }else{
                throw Error("only allow get or post method!")
            }
        }

        // 如果是ref，则转换成值，注意，如果ref是一个对象，toValue的结果是reactive对象
        if (config?.data) {
            config.data = toValue(config.data)
        }

        try {
            responseData.value = await request.requestApi<R>(addAuthHeader(config))
        } catch (error) {
            return await handleKnownError(error as NormalizedResponseError)
        }
    }

    if (config?.onMounted) {
        onMounted(async () => {
            await authRequest()
        })
    }

    if (config?.watchSources) {
        // 默认情况下，watchSource会做为参数传递给回调函数，由于回调函数已经确定，避免传入意外参数
        watch(config.watchSources, () => authRequest(), config?.watchOptions)
    }

    return {responseData: responseData as Ref<R>, authRequest}
}

export function useAuthPost<R>(url: string, postData?: any, config?: authRequestConfig) {

    const {responseData, authRequest: authPost} = useAuthRequest<R>(
        Object.assign(config ?? {}, {url, data: postData, method: 'post'})
    )
    return {responseData, authPost}
}

export function useAuthGet<R>(url: string, config?: authRequestConfig) {
    const {responseData, authRequest: authGet} = useAuthRequest<R>(
        Object.assign(config ?? {}, {url, method: 'get'})
    )
    return {responseData, authGet}
}
