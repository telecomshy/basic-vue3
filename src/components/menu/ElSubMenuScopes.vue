<template>
    <el-sub-menu v-show="showSubMenu">
        <template #title>
            <slot name="title"></slot>
        </template>
        <slot></slot>
    </el-sub-menu>
</template>

<script setup lang="ts">
import {ref, provide} from 'vue'

const showSubMenu = ref<boolean>(false);
provide('showSubMenu', showSubMenu)
</script>

