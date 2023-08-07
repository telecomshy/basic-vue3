import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {isRef, onMounted, Ref, ref, toValue, watch, WatchOptions, WatchSource} from "vue";
import {deepToRaw, saveBlobToFile} from "@/utils/utils.ts";

type ResponseHandler = <C extends ActiveRequestConfig>(response: AxiosResponse, config: C) => Promise<any>
type UseResponseHandler = () => ({
    responseHandler: ResponseHandler
})

type ErrorHandler = <C extends ActiveRequestConfig>(error: any, config: C) => void
type UseErrorHandler = () => ({
    errorHandler: ErrorHandler
})

export interface ActiveRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean
    watchSources?: WatchSource
    watchOptions?: WatchOptions
    defaultResponseData?: any
    authorizationKey?: string
    useToken?: () => string
    useResponseHandler?: UseResponseHandler
    useErrorHandler?: UseErrorHandler
    deepToRaw?: boolean
}

export class ActiveRequest<C extends ActiveRequestConfig> {
    private readonly $axios: AxiosInstance;
    private readonly config: C | {};

    constructor(config?: C) {
        this.config = config ?? {}
        this.$axios = axios.create(this.config)
    }

    useActiveRequest<R>(config?: C) {
        const localConfig = {...this.config, ...config ?? {}}
        const responseData = ref(localConfig.defaultResponseData)
        const axiosInst = this.$axios

        const useResponseHandler = localConfig?.useResponseHandler
        const useErrorHandler = localConfig?.useErrorHandler

        let responseHandler: ResponseHandler | null = useResponseHandler ? useResponseHandler().responseHandler : null
        let errorHandler: ErrorHandler | null = useErrorHandler ? useErrorHandler().errorHandler : null

        let token: string | null = null

        if (localConfig.useToken) {
            token = localConfig.useToken()
        }

        const deep = localConfig.deepToRaw ?? false

        async function request<R>(dataOrParams?: any): Promise<R> {
            // activeRequest也可以接收参数，某些情况下，我们不想事先申明一个响应式的请求参数，而是直接输入一个请求参数
            if (dataOrParams) {
                if (localConfig.method === 'post') {
                    localConfig.data = dataOrParams
                } else {
                    localConfig.params = dataOrParams
                }
            }

            // 如果传递的data参数是Ref，则需要转换为普通对象
            if (localConfig.data) {
                if (deep) {
                    localConfig.data = deepToRaw(localConfig.data)
                } else if (isRef(localConfig.data)) {
                    localConfig.data = toValue(localConfig.data)
                }
            }

            // 同理，params也需要转换
            if (localConfig.params) {
                if (deep) {
                    localConfig.params = deepToRaw(localConfig.params)
                } else if (isRef(localConfig.params)) {
                    localConfig.params = toValue(localConfig.params)
                }
            }

            // 如果提供了token选项，则添加Authorization头
            if (token) {
                localConfig.headers = localConfig.headers || {};
                const authorizationKey = localConfig.authorizationKey ?? "Authorization"
                localConfig.headers[authorizationKey] = token
            }

            try {
                const response = await axiosInst.request(localConfig)
                let data: any

                if (responseHandler) {
                    data = await responseHandler<C>(response, localConfig as C)
                } else {
                    data = response.data
                }

                responseData.value = data
                return Promise.resolve(data)
            } catch (error) {
                if (errorHandler) {
                    await errorHandler<C>(error, localConfig as C)
                }
                return Promise.reject(error)
            }
        }

        if (localConfig.onMounted) {
            onMounted(async () => {
                await request();
            })
        }

        if (localConfig.watchSources) {
            watch(localConfig.watchSources, () => request(), localConfig.watchOptions)
        }

        return {responseData: responseData as Ref<R>, request}
    }

    useActiveGet<R>(url: string, config?: C) {
        const {responseData, request: get} = this.useActiveRequest<R>({
            ...config ?? {},
            url,
            method: 'get'
        } as C)

        return {responseData, get}
    }

    useActivePost<R>(url: string, postData?: any, config?: C) {
        const {responseData, request: post} = this.useActiveRequest<R>({
            ...config ?? {},
            url,
            data: postData,
            method: 'post'
        } as C)

        return {responseData, post}
    }

    async download(url: string, filename: string, method?: 'get' | 'post', dataOrParams?: any) {
        const {request} = this.useActiveRequest({
            url,
            method,
            responseType: 'blob'
        } as C)

        const blob = await request<Blob>(dataOrParams)
        saveBlobToFile(blob, filename)
    }
}
