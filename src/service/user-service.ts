import {useAuthHelper} from "@/service/auth-service.ts";
import {isReactive, onMounted, ref, Ref, watch, watchEffect} from "vue";
import type {User, UpdateUserData} from "@/types/api-types.ts"


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

export function useUpdateUser(url: string) {
    const {authPostRequest} = useAuthHelper()

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
