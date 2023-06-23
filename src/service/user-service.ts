import {useAuthHelper} from "@/service/auth-service.ts";
import {onMounted, ref, Ref, watchEffect} from "vue";


export function useGetUserCounts(url: string) {
    const {authGet} = useAuthHelper()
    const userTotal = ref<number>(0)

    async function getUserCounts() {
        try {
            userTotal.value = await authGet(url)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    onMounted(async () => {
        await getUserCounts()
    })

    return {userTotal}
}


export function useGetUsers(url: string, page: Ref<number>, pageSize: Ref<number>) {
    const {authGet} = useAuthHelper()
    const users = ref<User[]>([])

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


export function useUpdateUser(url: string) {
    const {authPost} = useAuthHelper()

    const updateUserData = ref<UpdateUser>({
        id: -1,
        username: "",
        email: "",
        phoneNumber: "",
        roles: []
    })

    async function updateUser() {
        try {
            return await authPost(url, updateUserData.value)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {updateUserData, updateUser}
}
