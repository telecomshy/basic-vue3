<template>
    <div class="h-full w-full flex justify-between items-center">
        <el-image :src="logoUrl" class="h-[35px]"/>
        <el-popover trigger="click" :width="220" placement="bottom-end" popper-class="!p-[22px]">
            <template #reference>
                <el-avatar :size="30" :src="avatarUrl"/>
            </template>
            <div class="flex items-center">
                <el-avatar :size="35" :src="avatarUrl" class="mr-3"/>
<!--                <el-text tag="b">{{ authStore.authData.username }}</el-text>-->
                <el-text tag="b">{{ username }}</el-text>
            </div>
            <el-divider/>
            <div class="pl-[5px]">
                <div class="flex items-center mb-[15px] hover:text-[#307cfb] cursor-pointer">
                    <el-icon class="mr-[20px]">
                        <Lock/>
                    </el-icon>
                    <span>修改密码</span>
                </div>
                <div class="flex items-center mr-[15px] hover:text-[#307cfb] cursor-pointer">
                    <el-icon class="mr-[20px]">
                        <UserIcon/>
                    </el-icon>
                    <span @click="logout()">退出登陆</span>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import avatarUrl from "@/assets/icons/user.png"
import logoUrl from "@/assets/icons/logo.png"
// import {useAuthStore} from "@/stores/auth";
import {Lock, User as UserIcon} from "@element-plus/icons-vue";
import {useLogout} from "@/service/auth-service";
import {useActiveAuthGet} from "../../../backup/active-request.ts";

// const authStore = useAuthStore()
const {logout} = useLogout()

const {responseData: username} = useActiveAuthGet('/current-user', {onMounted: true})
</script>
