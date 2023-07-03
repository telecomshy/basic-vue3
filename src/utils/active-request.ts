import {AxiosRequestConfig} from "axios";
import {NormalizedResponseError, request} from "@/utils/request.ts";
import {onMounted, ref, Ref, toValue, watch, WatchOptions, WatchSource} from "vue";
//@ts-ignore
import {ElMessage} from "element-plus";
import {useRequestHelper} from "@/utils/request-helper.ts";

const authorizationKey = "Authorization"

export interface activeRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean,
    watchSources?: WatchSource,
    watchOptions?: WatchOptions,
    showError?: boolean,
    errorType?: 'error' | 'warn' | 'info',
    errorMessage?: string,
    tokenAuth?: boolean,
    sync?: boolean,
    defaultResponseData?: any
}

export function useActiveRequest<R>(config: activeRequestConfig) {
    const {handleError, getToken} = useRequestHelper(config)
    const responseData = ref(config.defaultResponseData)

    function addTokenHeader(config: AxiosRequestConfig) {
        const token = getToken()

        if (config.headers) {
            config.headers[authorizationKey] = token
        } else {
            config.headers = {[authorizationKey]: token}
        }

        return config
    }

    async function activeRequest<R>(data?: any) {
        if (data !== undefined) {
            if (config?.method === 'post') {
                Object.assign(config, {data})
            } else {
                Object.assign(config, {params: data})
            }
        }

        // 如果是ref，则转换成值，注意，如果ref是一个对象，toValue的结果是reactive对象
        if (config?.data) {
            config.data = toValue(config.data)
        }

        // params也要进行转换
        if (config?.params) {
            config.params = toValue(config.params)
        }

        if (config?.tokenAuth) {
            addTokenHeader(config)
        }

        try {
            if (config?.sync) {
                return await request.requestApi<R>(config)
            }
            responseData.value = await request.requestApi<R>(config)
        } catch (error) {
            await handleError(error as NormalizedResponseError)
            return Promise.reject(error)
        }
    }

    if (config?.onMounted) {
        onMounted(async () => {
            await activeRequest()
        })
    }

    if (config?.watchSources) {
        // 默认情况下，watchSource会做为参数传递给回调函数，由于回调函数已经确定，避免传入意外参数
        watch(config.watchSources, () => activeRequest(), config?.watchOptions)
    }

    return {responseData: responseData as Ref<R>, activeRequest}
}

export function useActivePost<R>(url: string, postData?: any, config?: activeRequestConfig) {
    const {responseData, activeRequest: activePost} = useActiveRequest<R>(
        Object.assign(config ?? {}, {url, data: postData, method: 'post'})
    )
    return {responseData, activePost}
}

export function useActiveGet<R>(url: string, config?: activeRequestConfig) {
    const {responseData, activeRequest: activeGet} = useActiveRequest<R>(
        Object.assign(config ?? {}, {url, method: 'get'})
    )
    return {responseData, activeGet}
}

export function useActiveAuthPost<R>(url: string, postData?: any, config?: activeRequestConfig) {
    const {responseData, activePost: activeAuthPost} = useActivePost<R>(
        url, postData, Object.assign(config ?? {}, {tokenAuth: true})
    )
    return {responseData, activeAuthPost}
}

export function useActiveAuthGet<R>(url: string, config?: activeRequestConfig) {
    const {responseData, activeGet: activeAuthGet} = useActiveGet<R>(
        url, Object.assign(config ?? {}, {tokenAuth: true})
    )
    return {responseData, activeAuthGet}
}
