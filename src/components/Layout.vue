<template>
    <el-container class="h-full">
        <el-header height="70px" class="bg-amber-200">
            Header
        </el-header>
        <el-container>
            <el-aside width="200px" class="bg-[#e8edf1]">
                <el-menu
                    active-text-color="#dde4ea"
                    background-color="#e8edf1"
                >
                    <el-menu-item index="1">
                        <el-icon>
                            <setting/>
                        </el-icon>
                        <span>系统首页</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <location/>
                            </el-icon>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item index="1-1">用户管理</el-menu-item>
                        <el-menu-item index="1-2">角色管理</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAuthStore} from "@/stores/auth";
import {Location, Setting} from "@element-plus/icons-vue";


const router = useRouter()
const authStore = useAuthStore()

console.log(authStore.isLogin)


</script>

<style scoped>

</style>
