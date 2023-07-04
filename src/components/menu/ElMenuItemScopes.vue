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
const {subMenuState, showSubMenu} = inject('subMenuState', {})
const scopes = inject<Ref<string[]>>('scopes', ref([]))
let showMenuItem = ref<boolean>(false)

watch(scopes, () => {
    if (props.requireScopes) {
        const requireScopes = Array.isArray(props.requireScopes) ? props.requireScopes : [props.requireScopes];
        const userScopes = new Set(scopes.value)
        showMenuItem.value = requireScopes.every(requireScope => userScopes.has(requireScope));
    } else {
        showMenuItem.value = true;
    }

    if (showMenuItem.value && subMenuState?.value === false) {
        showSubMenu()
    }
})
</script>
