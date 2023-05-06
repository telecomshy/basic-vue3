<template>
    <el-config-provider size="default" :z-index="3000" :locale="zhCn">
        <router-view :key="$route.fullPath"></router-view>
    </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>
