import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {isRef, onMounted, Ref, ref, toValue, watch, WatchOptions, WatchSource} from "vue";
import {saveBlobToFile} from "@/utils/utils.ts";

type ResponseHandler = (response: AxiosResponse, config: ActiveRequestConfig) => Promise<any>
type UseResponseHandler = () => {
    responseHandler: ResponseHandler
}

type ErrorHandler = (error: any, config: ActiveRequestConfig) => void
type UseErrorHandler = () => {
    errorHandler: ErrorHandler
}

export interface ActiveRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean;
    watchSources?: WatchSource;
    watchOptions?: WatchOptions;
    defaultResponseData?: any;
    authorizationKey?: string;
    useToken?: () => string;
    useResponseHandler?: UseResponseHandler;
    useErrorHandler?: UseErrorHandler;
    [key: string]: any
}

export class ActiveRequest {
    private readonly $axios: AxiosInstance;
    private readonly config: ActiveRequestConfig;

    constructor(config?: ActiveRequestConfig) {
        this.config = config ?? {}
        this.$axios = axios.create(this.config)
    }

    useActiveRequest<R>(config?: ActiveRequestConfig) {
        const localConfig = {...this.config, ...config ?? {}}
        const responseData = ref(localConfig.defaultResponseData)
        const axiosInst = this.$axios
        let token: string

        const useResponseHandler = localConfig?.useResponseHandler
        const useErrorHandler = localConfig?.useErrorHandler

        let responseHandler: ResponseHandler | null = useResponseHandler ? useResponseHandler().responseHandler : null
        let errorHandler: ErrorHandler | null = useErrorHandler ? useErrorHandler().errorHandler : null

        if (localConfig.useToken) {
            token = localConfig.useToken()
        }

        async function request<R>(dataOrParams?: any) {
            // activeRequest也可以接收参数，某些情况下，我们不想事先申明一个响应式的请求参数，而是直接输入一个请求参数
            if (typeof dataOrParams !== 'undefined') {
                if (localConfig.method === 'post') {
                    localConfig.data = dataOrParams
                } else {
                    localConfig.params = dataOrParams
                }
            }

            // 如果传递的data参数是Ref，则需要转换为普通对象
            if (localConfig.data && isRef(localConfig.data)) {
                localConfig.data = toValue(localConfig.data)
            }

            // 同理，params也需要转换
            if (localConfig.params && isRef(localConfig.params)) {
                localConfig.params = toValue(localConfig.params)
            }

            // 如果提供了token选项，则添加Authorization头
            if (token) {
                localConfig.headers = localConfig.headers || {};
                const authorizationKey = localConfig.authorizationKey ?? "Authorization"
                localConfig.headers[authorizationKey] = token
            }

            try {
                const response = await axiosInst.request(localConfig)
                let data

                if (responseHandler) {
                    data = await responseHandler(response, localConfig)
                } else {
                    data = response.data
                }

                responseData.value = data as R
                return Promise.resolve(data)
            } catch (error) {
                if (errorHandler) {
                    await errorHandler(error, localConfig)
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

    useActiveGet<R>(url: string, config?: ActiveRequestConfig) {
        const {responseData, request: get} = this.useActiveRequest<R>({
            ...config ?? {},
            url,
            method: 'get'
        })
        return {responseData, get}
    }

    useActivePost<R>(url: string, postData?: any, config?: ActiveRequestConfig) {
        const {responseData, request: post} = this.useActiveRequest<R>({
            ...config ?? {},
            url,
            data: postData,
            method: 'post'
        })
        return {responseData, post}
    }

    async download(url: string, filename: string, method?: 'get' | 'post', dataOrParams?: any) {
        const config: ActiveRequestConfig = {
            url,
            method,
            responseType: 'blob'
        }

        const {request} = this.useActiveRequest(config)
        const blob = await request(dataOrParams)
        saveBlobToFile(blob, filename)
    }
}
