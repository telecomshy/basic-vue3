import {defineStore} from "pinia";
import {computed, ref} from "vue";

export interface AuthData {
    username: string,
    token: string,
    scopes: string[]
}

export const useAuthStore = defineStore("auth",
    () => {
        const authData = ref<AuthData>({
            username: "",
            token: "",
            scopes: []
        })

        const loggedIn = computed(() => {
            return !!authData.value.token
        })

        return {authData, loggedIn}
    },
    {
        persist: true
    }
)
