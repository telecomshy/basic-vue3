import type {ServiceError} from "@/types/apiTypes";
import {ElMessage} from "element-plus";

export const errHandler = (error: ServiceError) => {
    ElMessage({type: "error", message: error.message})
}
