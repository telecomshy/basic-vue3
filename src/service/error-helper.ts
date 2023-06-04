import {NormalizedResponseError} from "@/utils/request";
import {ElMessage} from "element-plus";

export const showErrorMessage = (error: unknown) => {
    if (error instanceof NormalizedResponseError) {
        ElMessage.error(error.message)
    }else{
        console.error("unexpected error:", error)
    }
}