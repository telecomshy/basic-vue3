<template>
    <el-menu-item v-if="showMenuItem">
        <template #title>
            <slot name="title"></slot>
        </template>
        <slot></slot>
    </el-menu-item>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth";
import {inject, Ref} from "vue";

const authStore = useAuthStore()
const props = defineProps<{ requireScopes?: string | string[] }>()
const showSubMenu = inject<Ref<boolean> | undefined>('showSubMenu', undefined)
let requireScopes: string[]
let showMenuItem: boolean

if (!props.requireScopes) {
    showMenuItem = true
} else {
    if (typeof props.requireScopes === "string") {
        requireScopes = [props.requireScopes]
    } else {
        requireScopes = [...props.requireScopes]
    }
    showMenuItem = requireScopes.every(item => authStore.authData.scopes.includes(item))
}

if (showMenuItem && showSubMenu?.value === false) {
    showSubMenu.value = true
}
</script>
