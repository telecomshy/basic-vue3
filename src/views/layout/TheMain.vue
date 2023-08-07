<template xmlns="">
    <el-container class="h-full">
        <el-header height="50px" class="flex items-center bg-[#f3f7fa] shadow-sm shadow-gray-200 z-[2001]">
            <slot name="header">
                <span class="font-bold text-base w-[200px]"> {{ route.meta.label }} </span>
                <slot name="header-content"></slot>
            </slot>
        </el-header>
        <el-main class="bg-[#f3f7fa]">
            <slot><el-empty description="暂无数据" /></slot>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
</script>
