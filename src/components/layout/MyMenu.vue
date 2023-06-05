<template>
    <el-menu active-text-color="#dde4ea" background-color="#e8edf1">
        <el-menu-item index="1">
            <el-icon>
                <setting/>
            </el-icon>
            <span>系统首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <el-image :src="settingsUrl"/>
                </el-icon>
                <span>系统管理</span>
            </template>
            <el-menu-item index="1-1">用户管理</el-menu-item>
            <el-menu-item index="1-2">角色管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu-scopes>
            <template #title>
                <el-icon>
                    <location/>
                </el-icon>
                <span>子菜单</span>
            </template>
            <el-menu-item-scopes require-scopes="role">测试菜单1</el-menu-item-scopes>
            <el-menu-item-scopes require-scopes="user">测试菜单2</el-menu-item-scopes>
        </el-sub-menu-scopes>
    </el-menu>
</template>

<script setup lang="ts">
import ElSubMenuScopes from "@/components/menu/ElSubMenuScopes.vue";
import {Location, Setting} from "@element-plus/icons-vue";
import ElMenuItemScopes from "@/components/menu/ElMenuItemScopes.vue";
import settingsUrl from "@/assets/settings.svg"
</script>

<style scoped>

</style>