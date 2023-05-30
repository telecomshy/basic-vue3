import {Ref, watch} from "vue";
import {ElMessage} from "element-plus";

export function requestErrorHandler(error: Ref) {
    watch(error, error => {
        ElMessage({type: "error", message: error.message})
    })
}