<template>
    <el-container class="h-full">
        <el-header
            class="h-[60px] flex items-center border-b border-gray-200 bg-gradient-to-b from-[#f1f5f8] to-[#f3f7fa]">
            <slot name="header">
                <span class="font-bold text-lg mr-5"> {{ route.meta.label }} </span>
                <slot name="header-content"></slot>
            </slot>
        </el-header>
        <el-main class="bg-gray-100">
            <slot></slot>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
</script>
