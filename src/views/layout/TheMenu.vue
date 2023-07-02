<template>
    <el-menu-scopes background-color="#e8edf1" router :default-active="router.currentRoute.value.fullPath"
                    :scopes="scopes">
        <el-menu-item-scopes index="/">
            <el-image :src="indexUrl" class="h-6 w-6 mr-4"></el-image>
            <span>系统首页</span>
        </el-menu-item-scopes>
        <el-sub-menu-scopes index="setting">
            <template #title>
                <el-image :src="settingsUrl" class="h-6 w-6 mr-4"></el-image>
                <span>系统设置</span>
            </template>
            <el-menu-item-scopes index="/role" require-scopes="role" class="ml-5">角色管理</el-menu-item-scopes>
            <el-menu-item-scopes index="/user" require-scopes="user" class="ml-5">用户管理</el-menu-item-scopes>
        </el-sub-menu-scopes>
    </el-menu-scopes>
</template>

<script setup lang="ts">
import ElSubMenuScopes from "@/components/menu/ElSubMenuScopes.vue";
import ElMenuItemScopes from "@/components/menu/ElMenuItemScopes.vue";
import ElMenuScopes from "@/components/menu/ElMenuScopes.vue";
import settingsUrl from "@/assets/icons/settings.svg"
import indexUrl from "@/assets/icons/index.svg"
import {useRouter} from "vue-router";
import {useActiveAuthGet} from "@/utils/active-request.ts";

const router = useRouter()
const {responseData: scopes} = useActiveAuthGet<string[]>('/current-user-scope', {onMounted: true})
</script>

<style scoped>
.el-menu-item.is-active {
    font-weight: bold;
    color: #41484f
}

.el-menu-item:hover {
    background-color: #dde4ea
}

.el-menu {
    border-right: 0;
}
</style>
