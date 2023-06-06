<template>
    <div class="h-full w-full flex justify-between items-center">
        <el-image :src="logoUrl" class="h-[35px]"/>
        <el-avatar :size="30" :src="avatarUrl"/>
    </div>
</template>

<script setup lang="ts">
import avatarUrl from "@/assets/icons/user.png"
import logoUrl from "@/assets/icons/logo.png"
</script>
