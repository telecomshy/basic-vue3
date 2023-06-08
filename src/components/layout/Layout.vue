<template>
    <el-container class="h-full">
        <el-header height="55px">
            <the-header/>
        </el-header>
        <el-container>
            <el-aside width="200px" class="bg-[#e8edf1]">
                <the-menu></the-menu>
            </el-aside>
            <el-main class="!p-0">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import TheHeader from "@/components/layout/TheHeader.vue";
import TheMenu from "@/components/layout/TheMenu.vue";
</script>

