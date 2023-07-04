<template>
    <el-sub-menu v-show="subMenuState">
        <template #title>
            <slot name="title"></slot>
        </template>
        <slot></slot>
    </el-sub-menu>
</template>

<script setup lang="ts">
import {ref, provide} from 'vue'

const subMenuState = ref<boolean>(false);
const showSubMenu = () => {
    subMenuState.value = true
}

provide('subMenuState', {subMenuState, showSubMenu})
</script>

