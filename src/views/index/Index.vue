<template>
    <div>index: {{ mode }}</div>
    <ElButton>点击</ElButton>
    <el-date-picker type="date" />
</template>

<script setup lang="ts">
const mode = import.meta.env.VITE_BASE_URL
</script>