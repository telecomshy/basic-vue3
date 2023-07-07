import {AxiosRequestConfig} from "axios";
import {NormalizedResponseError, request} from "@/utils/request.ts";
import {onMounted, ref, Ref, toValue, watch, WatchOptions, WatchSource} from "vue";
//@ts-ignore
import {ElMessage} from "element-plus";
import {useRequestHelper} from "@/utils/request-helper.ts";

const authorizationKey = "Authorization";

export interface ActiveRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean;
    watchSources?: WatchSource;
    watchOptions?: WatchOptions;
    showError?: boolean;
    errorType?: 'error' | 'warn' | 'info';
    errorMessage?: string;
    tokenAuth?: boolean;
    defaultResponseData?: any;
}

export function useActiveRequest<R>(config: ActiveRequestConfig) {
    const {handleError, getToken} = useRequestHelper(config);
    const responseData = ref(config.defaultResponseData);
    const token = getToken();
    const newConfig: ActiveRequestConfig = {...config};

    function addTokenHeader(config: ActiveRequestConfig) {
        config.headers = config.headers || {};
        config.headers[authorizationKey] = token;
        return config;
    }

    async function activeRequest<R>(dataOrParams?: any) {
        if (dataOrParams !== undefined) {
            if (newConfig.method === 'post') {
                newConfig.data = dataOrParams;
            } else {
                newConfig.params = dataOrParams;
            }
        }

        if (newConfig.data) {
            newConfig.data = toValue(newConfig.data);
        }
        if (newConfig.params) {
            newConfig.params = toValue(newConfig.params);
        }
        if (newConfig.tokenAuth) {
            addTokenHeader(newConfig);
        }

        try {
            const response = await request.requestApi<R>(newConfig);
            responseData.value = response;
            return response
        } catch (error) {
            await handleError(error as NormalizedResponseError);
            throw error
        }
    }

    if (config.onMounted) {
        onMounted(async () => {
            await activeRequest();
        });
    }
    if (config.watchSources) {
        watch(config.watchSources, () => activeRequest(), config.watchOptions);
    }
    return {responseData: responseData as Ref<R>, activeRequest};
}

export function useActivePost<R>(url: string, postData?: any, config?: ActiveRequestConfig) {
    const {responseData, activeRequest: activePost} = useActiveRequest<R>({
        ...(config || {}),
        url,
        data: postData,
        method: 'post',
    });
    return {responseData, activePost};
}

export function useActiveGet<R>(url: string, config?: ActiveRequestConfig) {
    const {responseData, activeRequest: activeGet} = useActiveRequest<R>({
        ...(config || {}),
        url,
        method: 'get',
    });
    return {responseData, activeGet};
}

export function useActiveAuthPost<R>(url: string, postData?: any, config?: ActiveRequestConfig) {
    const {responseData, activeRequest: activeAuthPost} = useActiveRequest<R>({
        ...(config || {}),
        url,
        data: postData,
        method: 'post',
        tokenAuth: true
    });
    return {responseData, activeAuthPost};
}

export function useActiveAuthGet<R>(url: string, config?: ActiveRequestConfig) {
    const {responseData, activeRequest: activeAuthGet} = useActiveRequest<R>({
        ...(config || {}),
        url,
        method: 'get',
        tokenAuth: true
    });
    return {responseData, activeAuthGet};
}
