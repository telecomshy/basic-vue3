import {useAuthRequest} from "@/service/auth-service.ts";
import {isReactive, onMounted, ref, Ref, watch, watchEffect} from "vue";
import type {User, UpdateUserData} from "@/types/api-types.ts"

export function useGetUserCounts(url: string) {
    const {authGetRequest} = useAuthRequest()
    const userTotal = ref<number>(0)

    async function getUserCounts() {
        try {
            userTotal.value = await authGetRequest(url)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    onMounted(async () => {
        await getUserCounts()
    })

    return {userTotal}
}


// export function useGetUsers(url: string, page: Ref<number>, pageSize: Ref<number>) {
//     const {authGet} = useAuthRequest()
//     const users = ref<User[]>([])
//
//     async function getUsers() {
//         try {
//             users.value = await authGet(url, {
//                 params: {
//                     page: page.value - 1,
//                     page_size: pageSize.value
//                 }
//             })
//         } catch (error) {
//             return Promise.reject(error)
//         }
//     }
//
//     watchEffect(getUsers)
//
//     return {users, getUsers}
// }

export function useAuthPost(url: string, config?: any) {
    const {authPostRequest} = useAuthRequest()
    const responseData = ref()
    const postData = ref<{ [key: string]: any }>({})

    async function authPost() {
        try {
            responseData.value = await authPostRequest(url, postData.value)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    if (config?.mounted) {
        onMounted(async () => {
            await authPost()
        })
    }

    if (config?.watch) {
        watch(postData.value, ()=>{console.log('watch')}, {deep: true})
    }

    return {responseData, postData, authPost}
}

export function useUpdateUser(url: string) {
    const {authPostRequest} = useAuthRequest()

    const updateUserData = ref<UpdateUserData>({
        id: 0,
        username: "",
        email: "",
        phoneNumber: "",
        roles: []
    })

    async function updateUser() {
        try {
            return await authPostRequest(url, updateUserData.value)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {updateUserData, updateUser}
}
