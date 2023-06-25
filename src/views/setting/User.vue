<template>
    <the-main>
        <template #header-content></template>
        <el-table :data="users" class="w-full">
            <el-table-column prop="id" v-if="false"/>
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" prop="username" label="用户名"/>
            <el-table-column align="center" prop="email" label="邮箱"/>
            <el-table-column align="center" prop="phoneNumber" label="手机号码"/>
            <el-table-column align="center" prop="roles" label="用户角色" :formatter="getRolesString"/>
            <el-table-column align="center" width="200">
                <template #default="scope">
                    <el-button size="large" icon="Edit" circle plain text
                               @click="handleEdit(scope.$index, scope.row)"/>
                    <el-button size="large" icon="Delete" circle plain text
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
        <el-dialog id="editUserDialog" v-model="dialogVisible" width="610" draggable>
            <template #header>
                <el-text tag="b" size="large">编辑用户</el-text>
            </template>
            <el-form :model="updateUserData" label-position="top">
                <el-divider content-position="right">
                    <el-text size="small">
                        <el-icon>
                            <Edit/>
                        </el-icon>
                        基础信息
                    </el-text>
                </el-divider>
                <div class="flex justify-between">
                    <el-form-item label="用户名">
                        <el-input v-model="updateUserData.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="updateUserData.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input v-model="updateUserData.phoneNumber"></el-input>
                    </el-form-item>
                </div>
                <el-divider content-position="right">
                    <el-text size="small">
                        <el-icon>
                            <User/>
                        </el-icon>
                        角色配置
                    </el-text>
                </el-divider>
                <div class="flex">
                    <el-form-item label="角色">
                        <el-select class="w-[270px]" v-model="updateUserData.roles" collapse-tags collapse-tags-tooltip
                                   :max-collapse-tags="2" multiple>
                            <el-option v-for="role in roles" :key="role.id" :label="role.roleName" :value="role.id"/>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="handleSave">保存</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </template>
        </el-dialog>
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";
import {ref} from "vue";
import {useGetUserCounts, useGetUsers, useUpdateUser} from "@/service/user-service.ts";
import {useGetRoles} from "@/service/role-service.ts";
import {showErrorMessage} from "@/service/error-helper.ts";

const page = ref<number>(1)
const pageSize = ref<number>(1)
const {userTotal} = useGetUserCounts('/user-counts')
const {users, getUsers} = useGetUsers('/users', page, pageSize)
const {roles} = useGetRoles('/roles')
const {updateUserData, updateUser} = useUpdateUser('/update-user')
const dialogVisible = ref<boolean>(false)

const getRolesString = (row, column, cellValue) => {
    return cellValue.map(item => item.roleName).join(",")
}

function handleEdit(index, row) {
    const user_copy = {...row}
    user_copy.roles = user_copy.roles.map(role => role.id)
    updateUserData.value = user_copy
    dialogVisible.value = true
}


async function handleSave() {
    try {
        await updateUser()
        dialogVisible.value = false
        await getUsers()
    } catch (error) {
        showErrorMessage(error)
    }
}


function handleDelete(index, row) {

}
</script>

<style>
#editUserDialog .el-dialog__body {
    padding: 0 20px;
}
</style>
