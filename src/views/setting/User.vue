<template>
    <the-main>
        <template #header-content></template>
        <el-table :data="users" class="w-full">
            <el-table-column prop="id" v-if="false"/>
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" prop="username" label="用户名"/>
            <el-table-column align="center" prop="email" label="邮箱"/>
            <el-table-column align="center" prop="phone_number" label="手机号码"/>
            <el-table-column align="center" prop="roles" label="用户角色"/>
            <el-table-column align="center" width="200">
                <template #default="scope">
                    <el-button size="large" icon="Edit" circle plain text bg
                               @click="handleEdit(scope.$index, scope.row)"/>
                    <el-button size="large" icon="Delete" circle plain text bg
                               @click="handleDelete(scope.$index, scope.row)"/>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="[1, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
            class="mt-[15px]"
        />

        <el-dialog v-model="dialogVisible" width="500" draggable>
            <template #header>用户编辑</template>
            <template #default>
                default content

            </template>
            <template #footer>
                <el-button>确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </template>
        </el-dialog>
    </the-main>


</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";
import {isReactive, reactive, ref, toRaw} from "vue";
import {useUserTotalService, useUsersService} from "@/service/user-service.ts";

const page = ref<number>(1)
const pageSize = ref<number>(1)
const {userTotal} = useUserTotalService('/user-counts')
const {users} = useUsersService('/users', page, pageSize)
const dialogVisible = ref<boolean>(false)

const selectedUser = ref({
    id: null,
    email: "",
    phone: "",
    roles: ""
})

function handleEdit(index, row) {
    console.log(Object.assign({}, row))
    dialogVisible.value = true
}

function handleDelete(index, row) {

}
</script>

<style scoped>

</style>