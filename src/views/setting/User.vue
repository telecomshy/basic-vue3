<template>
    <the-main>
        <template #header-content>search</template>
        <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="[100, 200, 300, 400]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";
import {ref} from "vue";

const page = ref<number>()
const pageSize = ref<number>()
const total = ref<number>(0)

function handleSizeChange(){

}

function handleCurrentChange(){

}
</script>

<style scoped>

</style>