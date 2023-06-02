<template>
    <el-menu-item v-if="">
        <slot name="title"></slot>
        <slot></slot>
    </el-menu-item>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useAuthService} from "@/service/auth-service";

const {authGet} = useAuthService()
let scopes = ref<string[]>([])

const props = defineProps<{
    requireScopes: string | string[]
}>()

onMounted(async () => {

})

</script>

<style scoped>

</style>