<template>
    <el-container class="h-full">
        <el-header
            class="h-[50px] flex items-center border-b border-gray-200 bg-[#f0f2f5]">
            <slot name="header">
                <span class="font-bold text-base mr-5"> {{ route.meta.label }} </span>
                <slot name="header-content"></slot>
            </slot>
        </el-header>
        <!--el-main class="bg-gradient-to-b from-[#f1f5f8] to-[#f3f7fa]"-->
        <el-main class="bg-[#f0f2f5]">
            <slot></slot>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
</script>
