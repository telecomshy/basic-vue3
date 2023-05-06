<template>
    <div class="w-screen h-screen cyan-gradient justify-align-center-[col]">
        <div class="flex w-2/3 h-2/3">
            <div class="w-0 flex-grow py-[40px] mr-[70px]">
                <el-image class="w-full h-full" :src="image" fit="contain"></el-image>
            </div>
            <div class="w-[390px] flex flex-col bg-white p-10 shadow">
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