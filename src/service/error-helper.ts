import {NormalizedResponseError} from "@/utils/request";
import {ElMessage} from "element-plus";

export const showErrorByElMessage = (error: NormalizedResponseError) => {
    ElMessage({type: "error", message: error.message})
}