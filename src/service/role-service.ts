import {useAuthRequest} from "@/service/auth-service.ts";
import {onMounted, ref} from "vue";
import type {Role} from "@/types/api-types.ts"

export function useGetRoles(url: string) {
    const {authGetRequest} = useAuthRequest()
    const roles = ref<Role[]>([])

    async function getRoles() {
        try {
            roles.value = await authGetRequest(url)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    onMounted(async () => {
        await getRoles()
    })

    return {roles}
}
