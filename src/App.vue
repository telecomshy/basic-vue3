<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="local">
    <router-view :key="$route.fullPath"></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const zIndex = 3000
const size = "default"
const local = zhCn
</script>
