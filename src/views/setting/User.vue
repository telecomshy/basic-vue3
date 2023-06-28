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
                <el-select class="w-[185px]" collapse-tags collapse-tags-tooltip v-model="queryUsersPostData.roles"
                           :max-collapse-tags="1" multiple size="large">
                    <el-option v-for="role in rolesData" :key="role.id" :label="role.roleName" :value="role.id"/>
                </el-select>
            </div>
            <div class="flex w-[200px] mr-[15px] search-label">
                <el-text>状态</el-text>
                <el-input placeholder="用户当前状态"></el-input>
            </div>
            <div class="flex w-[300px] search-label">
                <el-text>查询</el-text>
                <el-input placeholder="按用户名，邮箱或电话号码模糊匹配" v-model="queryUsersPostData.others"></el-input>
            </div>
            <el-button icon="search" class="ml-[10px]" size="large" circle text @click="getUsers"></el-button>
        </div>
        <el-table :data="usersData.users" class="w-full">
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
            v-model:current-page="queryUsersPostData.page"
            v-model:page-size="queryUsersPostData.pageSize"
            :page-sizes="[1, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="usersData.total"
            class="mt-[15px]"
        />
        <el-dialog class="edit-dialog" v-model="dialogVisible" width="610" draggable>
            <template #header>
                <el-text tag="b" size="large">编辑用户</el-text>
            </template>
            <el-form :model="updateUserPostData" label-position="top">
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
                        <el-input v-model="updateUserPostData.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="updateUserPostData.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input v-model="updateUserPostData.phoneNumber"></el-input>
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
                        <el-select class="w-[270px]" v-model="updateUserPostData.roles" collapse-tags
                                   collapse-tags-tooltip
                                   :max-collapse-tags="2" multiple>
                            <el-option v-for="role in rolesData" :key="role.id" :label="role.roleName"
                                       :value="role.id"/>
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
import TheMain from "@/views/layout/TheMain.vue"
import {reactive, ref} from "vue"
import {useAuthPost, useAuthGet} from "@/service/auth-helper"
import {showErrorMessage} from "@/service/error-helper"
import type {Role, User} from "@/types/api-types"
import {Edit, User as UserIcon} from "@element-plus/icons-vue"

// 控制对话框显示
const dialogVisible = ref(false)

// 用户查询
const queryUsersPostData = reactive({
    page: 1,
    pageSize: 1,  // 需要和pagination的设置保持一致
    roles: [],
    others: null
})

const {responseData: usersData, authPost: getUsers} = useAuthPost<{
    total: number,
    users: User[]
}>('/users', queryUsersPostData, {
    watchSources: () => [queryUsersPostData.page, queryUsersPostData.pageSize],
    watchOptions: {immediate: true}
})

// TODO 获取所有角色，后期需要修改，提供一个统一的post查询接口
const {responseData: rolesData} = useAuthGet<Role[]>('/roles', {onMounted: true})

// 更新用户
const updateUserPostData = reactive({
    id: null,
    username: null,
    email: null,
    phoneNumber: null,
    roles: []
})
const {authPost: updateUser} = useAuthPost('/update-user', updateUserPostData)

// 处理编辑事件，传入当前行的索引和用户对象
function handleEdit(_index: number, row: User): void {
    // 复制当前用户对象，将其角色数组转换为角色ID数组
    const userCopy = {
        ...row,
        roles: row.roles.map(role => role.id),
    }
    // 将复制后的用户对象合并到更新用户数据对象中
    Object.assign(updateUserPostData, userCopy);
    dialogVisible.value = true;
}

// 点击保存按钮，保存用户
async function handleSave() {
    try {
        await updateUser()
        dialogVisible.value = false
        await getUsers()
    } catch (error) {
        showErrorMessage(error)
    }
}

// role单元格格式化函数，将返回的role数组转换为字符串
const getRolesString = (_row: any, _column: any, cellValue: Role[]) => {
    return cellValue.map(role => role.roleName).join(",")
}

// 删除用户
function handleDelete(_index: number, _row: User) {

}
</script>

<style>
.edit-dialog .el-dialog__body {
    padding: 10px 20px;
}

.search-label .el-text {
    word-break: keep-all;
    margin-right: 10px;
    margin-left: 5px;
}
</style>
