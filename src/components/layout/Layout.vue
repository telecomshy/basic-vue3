<template>
    <el-container class="h-full">
        <el-header height="55px">
            <my-header/>
        </el-header>
        <el-container>
            <el-aside width="200px" class="bg-[#e8edf1]">
                <my-menu></my-menu>
            </el-aside>
            <el-main class="!p-0">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import MyHeader from "@/components/layout/MyHeader.vue";
import MyMenu from "@/components/layout/MyMenu.vue";
</script>

