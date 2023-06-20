<template>
    <the-main>
        <template #header-content>search</template>
        <el-table :data="tableData" class="w-full">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>
        <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";
import {ref} from "vue";
import {useUserService} from "@/service/user-service.ts";

const page = ref<number>(0)
const pageSize = ref<number>(10)
const {userTotal} = useUserService()


const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]

function handleSizeChange(){

}

function handleCurrentChange(){

}
</script>

<style scoped>

</style>