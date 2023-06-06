<template>
    <el-container>
        <el-header class="flex items-center border-b border-gray-200">
            <slot name="header"></slot>
        </el-header>
        <el-main class="bg-gradient-to-b from-[#f1f5f8] to-[#f3f7fa]">
            <slot></slot>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
</script>
