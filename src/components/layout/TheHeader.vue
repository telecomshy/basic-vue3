<template>
    <div class="h-full w-full flex justify-between items-center">
        <el-image :src="logoUrl" class="h-[35px]"/>
        <el-popover trigger="click" :width="220" placement="bottom-end" popper-class="!p-[22px]">
            <template #reference>
                <el-avatar :size="30" :src="avatarUrl"/>
            </template>
            <div class="flex items-center">
                <el-avatar :size="35" :src="avatarUrl" class="mr-3"/>
                <el-text tag="b">{{ authStore.authData.username }}</el-text>
            </div>
            <el-divider class="!my-[15px]"/>
            <div class="pl-[5px]">
                <div class="flex items-center mb-[15px] hover:text-[#307cfb] cursor-pointer">
                    <el-icon class="mr-[20px]">
                        <Lock/>
                    </el-icon>
                    <span>修改密码</span>
                </div>
                <div class="flex items-center mr-[15px] hover:text-[#307cfb] cursor-pointer">
                    <el-icon class="mr-[20px]">
                        <User/>
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
import {useAuthStore} from "@/stores/auth";
import {Lock, User} from "@element-plus/icons-vue";
import {useAuthService} from "@/service/auth-service";

const authStore = useAuthStore()
const {logout} = useAuthService()
</script>
