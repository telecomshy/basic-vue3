import {useAuthService} from "@/service/auth-service.ts";
import {onMounted, ref} from "vue";


interface User {
    username: string,
    email: string,
    phone: string
    roles: string[]
}

export function useUserService() {
    const {authGet} = useAuthService()
    const userTotal = ref<number>(0)
    const users = ref<User>()

    async function getUserTotal() {
        try {
            userTotal.value = await authGet("/user-counts")
        } catch (error) {
            return Promise.reject(error)
        }
    }

    onMounted(async () => {
        await getUserTotal()
    })

    return {userTotal, users}
}