import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthStore = defineStore(
    "auth",
    () => {
        const isLogin = ref<boolean>(false)
        return {isLogin}
    },
    {
        persist: true,
    }
)
