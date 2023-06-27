<template>
    <the-main>
        <template #header-content>
            <div class="w-full flex flex-row-reverse">
                <el-button type="primary" class="ml-[10px]">导出用户</el-button>
                <el-button type="primary">新建用户</el-button>
            </div>
        </template>
        <div class="flex mb-[20px]">
            <div class="flex mr-[15px] search-label">
                <el-text>角色</el-text>
                <el-select class="w-[185px]" collapse-tags collapse-tags-tooltip v-model="searchRoles"
                           :max-collapse-tags="1" multiple>
                    <el-option v-for="role in roles" :key="role.id" :label="role.roleName" :value="role.id"/>
                </el-select>
            </div>
            <div class="flex w-[200px] mr-[15px] search-label">
                <el-text>状态</el-text>
                <el-input placeholder="按用户搜索"></el-input>
            </div>
            <div class="flex w-[400px] search-label">
                <el-text>查询</el-text>
                <el-input placeholder="按用户搜索" suffix-icon="search" v-model="userQueryData.username"></el-input>
            </div>
        </div>
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
            v-model:current-page="userQueryData.page"
            v-model:page-size="userQueryData.pageSize"
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
                            <UserIcon/>
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
import {reactive, ref} from "vue";
import {useUpdateUser} from "@/service/user-service.ts";
import {useAuthPost, useAuthGet} from "@/service/auth-service.ts";
import {showErrorMessage} from "@/service/error-helper.ts";
import type {Role, UpdateUserData, User, UserBase} from "@/types/api-types.ts"
import {Edit, User as UserIcon} from "@element-plus/icons-vue"
import type {TableColumnCtx} from 'element-plus'

// 控制对话框显示
const dialogVisible = ref<boolean>(false)

// 获取用户总数
const {responseData: userTotal} = useAuthGet('/user-counts', {onMounted: true})

// 用户查询
const userQueryData = reactive({
    page: 0,
    pageSize: 1,
    username: null,
})

const {responseData: users, authPost: getUsers} = useAuthPost('/users', userQueryData, {
    watchSources: () => ([userQueryData.page, userQueryData.pageSize])
})

// 获取所有角色
const {responseData: roles} = useAuthGet('/roles', {onMounted: true})

// 更新用户
const {updateUserData, updateUser} = useUpdateUser('/update-user')

const searchRoles = ref([])

const getRolesString = (_row: User, _column: TableColumnCtx<User>, cellValue: Role[]) => {
    return cellValue.map(item => item.roleName).join(",")
}

interface UserCopy extends UserBase {
    roles: Role[] | number[]
}

function handleEdit(_index: number, row: User): void {
    const userCopy: UserCopy = {...row}
    userCopy.roles = userCopy.roles.map(role => role.id)
    updateUserData.value = <UpdateUserData>userCopy
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


function handleDelete(_index: number, _row: User) {

}
</script>

<style scoped>
#editUserDialog .el-dialog__body {
    padding: 0 20px;
}

.search-label .el-text {
    word-break: keep-all;
    margin-right: 10px;
    margin-left: 5px;
}
</style>
