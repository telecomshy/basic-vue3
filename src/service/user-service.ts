import {useAuthService} from "@/service/auth-service.ts";
import {onMounted, ref, Ref, watchEffect} from "vue";


interface User {
    username: string,
    email: string,
    phone: string
    roles: string[]
}

export function useUserTotalService(url: string) {
    const {authGet} = useAuthService()
    const userTotal = ref<number>(0)

    async function getUserTotal() {
        try {
            userTotal.value = await authGet(url)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    onMounted(async () => {
        await getUserTotal()
    })

    return {userTotal}
}


export function useUsersService(url: string, page: Ref<number>, pageSize: Ref<number>) {
    const {authGet} = useAuthService()
    const users = ref<User[]>()

    async function getUsers() {
        try {
            users.value = await authGet(url, {
                params: {
                    page: page.value - 1,
                    page_size: pageSize.value
                }
            })
        } catch (error) {
            return Promise.reject(error)
        }
    }

    watchEffect(getUsers)

    return {users, getUsers}
}
