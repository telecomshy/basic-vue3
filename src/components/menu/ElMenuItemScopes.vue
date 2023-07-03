<template>
    <el-menu-item v-if="showMenuItem">
        <template #title>
            <slot name="title"></slot>
        </template>
        <slot></slot>
    </el-menu-item>
</template>

<script setup lang="ts">
import {inject, ref, Ref, watch} from "vue";

const props = defineProps<{ requireScopes?: string | string[] }>()
const showSubMenu = inject<Ref<boolean> | undefined>('showSubMenu', undefined)
const scopes = inject<Ref<string[]>>('scopes', ref([]))
let showMenuItem = ref<boolean>(false)

watch(scopes, () => {
    if (props.requireScopes) {
        let requireScopes = Array.isArray(props.requireScopes) ? props.requireScopes : [props.requireScopes];
        const authScopes = new Set(scopes.value)
        showMenuItem.value = requireScopes.every(item => authScopes.has(item));
    } else {
        showMenuItem.value = true;
    }

    if (showMenuItem.value && showSubMenu?.value === false) {
        showSubMenu.value = true
    }
})
</script>
