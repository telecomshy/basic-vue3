<template>
    <el-container class="h-full">
        <el-header height="55px">
            <my-header/>
        </el-header>
        <el-container>
            <el-aside width="200px" class="bg-[#e8edf1]">
                <my-menu></my-menu>
            </el-aside>
            <el-container>
                <el-header class="flex items-center font-semibold text-lg border-b border-gray-200">
                    {{ route.meta.label}}
                </el-header>
                <el-main class="bg-gradient-to-b from-[#f1f5f8] to-[#f3f7fa]">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import MyHeader from "@/components/layout/MyHeader.vue";
import MyMenu from "@/components/layout/MyMenu.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>

