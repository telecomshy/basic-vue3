<template>
    <el-menu active-text-color="#dde4ea" background-color="#e8edf1" class="border-0">
        <el-menu-item-scopes index="1">
            <el-image :src="settingsUrl" class="h-6 w-6 mr-4"></el-image>
            <span>系统首页</span>
        </el-menu-item-scopes>
        <el-sub-menu-scopes index="2">
            <template #title>
                <el-image :src="settingsUrl" class="h-6 w-6 mr-4"></el-image>
                <span>系统设置</span>
            </template>
            <el-menu-item-scopes require-scopes="role" class="ml-5">角色管理</el-menu-item-scopes>
            <el-menu-item-scopes require-scopes="user" class="ml-5">用户管理</el-menu-item-scopes>
        </el-sub-menu-scopes>
    </el-menu>
</template>

<script setup lang="ts">
import ElSubMenuScopes from "@/components/menu/ElSubMenuScopes.vue";
import ElMenuItemScopes from "@/components/menu/ElMenuItemScopes.vue";
import settingsUrl from "@/assets/settings.svg"
</script>

<style scoped>

</style>
