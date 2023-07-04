<script setup lang="ts">
import {provide, toRef} from "vue";

const props = defineProps<{ scopes: string[] }>()
provide('scopes', toRef(props, 'scopes'))
</script>

<template>
    <el-menu>
        <slot></slot>
    </el-menu>
</template>

