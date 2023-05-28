<template>
    <div class="w-screen h-screen cyan-gradient justify-align-center-[col]">
        <div class="flex w-3/4 h-3/4">
            <div class="w-0 flex-grow py-[35px] mr-[35px]">
                <el-image class="w-full h-full" :src="image" fit="contain"></el-image>
            </div>
            <div class="w-[378px] flex flex-col bg-white p-7 shadow">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    image: string
}

defineProps<Props>()
</script>

<style scoped>

</style>
