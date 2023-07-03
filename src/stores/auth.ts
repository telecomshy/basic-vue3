import {defineStore} from "pinia";

interface AuthState {
    token: string
}

// 使用组合式api的话，store.$reset方法会报错，官网目前没有组合式api详细介绍
// pinia-plugin-persistedstate官网有组合式的用法：
// https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
export const useAuthStore = defineStore<string, AuthState>('main', {
    state: () => {
        return {
            token: ""
        }
    },
    getters: {
        loggedIn(state) {
            return !!state.token
        },
    },
    persist: true,
})
