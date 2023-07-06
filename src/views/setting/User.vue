<template>
    <the-main>
        <template #header-content>
            <div class="w-full flex flex-row-reverse">
                <el-button type="primary" class="ml-[10px]"
                           @click="openDeleteUserMessageBox(usersSelection, '确认要删除所有选中的用户吗？')">批量删除
                </el-button>
                <el-button type="primary" class="ml-[10px]">导出用户</el-button>
                <el-button type="primary" class="ml-[10px]" @click="createUserDialogVisible=true">新建用户</el-button>
            </div>
        </template>
        <div class="flex mb-[20px]">
            <div class="flex mr-[15px] search-label">
                <el-text>角色</el-text>
                <el-select class="w-[185px]" collapse-tags collapse-tags-tooltip v-model="queryUsersData.rolesId"
                           :max-collapse-tags="1" multiple size="large">
                    <el-option v-for="role in rolesData" :key="role.id" :label="role.roleName" :value="role.id"/>
                </el-select>
            </div>
            <div class="flex w-[200px] mr-[15px] search-label">
                <el-text>状态</el-text>
                <el-select class="w-[185px]" v-model="queryUsersData.active" size="large" clearable>
                    <el-option :key="1" label="激活" :value="true"/>
                    <el-option :key="2" label="关停" :value="false"/>
                </el-select>
            </div>
            <div class="flex w-[300px] search-label">
                <el-text>查询</el-text>
                <el-input placeholder="按用户名，邮箱或电话号码模糊匹配" v-model="queryUsersData.others"
                          @keyup.enter="getUsers()"></el-input>
            </div>
            <el-button icon="search" class="ml-[10px]" size="large" circle text @click="getUsers()"></el-button>
        </div>
        <el-table :data="usersData.users" class="w-full" @selection-change="handleSelectionChange">
            <el-table-column prop="id" v-if="false"/>
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" prop="username" label="用户名"/>
            <el-table-column align="center" label="当前状态">
                <template #default="scope">
                    <el-icon size="16px" :color="scope.row.active?'#409EFF':'#c8c9cc'">
                        <UserFilled/>
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="email" label="邮箱"/>
            <el-table-column align="center" prop="phoneNumber" label="手机号码"/>
            <el-table-column align="center" prop="roles" label="用户角色" :formatter="getRolesString"/>
            <el-table-column align="center" width="200">
                <template #default="scope">
                    <el-tooltip content="编辑用户" placement="top" :offset="3" :hide-after="12">
                        <el-button size="large" icon="Edit" circle plain text
                                   @click="handleEditUser(scope.$index, scope.row)"/>
                    </el-tooltip>
                    <el-tooltip content="删除用户" placement="top" :offset="3" :hide-after="12">
                        <el-button size="large" icon="Delete" circle plain text
                                   @click="openDeleteUserMessageBox(scope.row.id, '确认删除该用户吗')"/>
                    </el-tooltip>
                    <el-tooltip content="重置密码" placement="top" :offset="3" :hide-after="12">
                        <el-button size="large" icon="Refresh" circle plain text
                                   @click="openResetPasswordMessageBox(scope.row.id)"/>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="queryUsersData.page"
            v-model:page-size="queryUsersData.pageSize"
            :page-sizes="[1, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="usersData.total"
            class="mt-[15px]"
        />
        <el-dialog class="edit-dialog" v-model="editUserDialogVisible" width="610" draggable>
            <template #header>
                <el-text tag="b" size="large">编辑用户</el-text>
                <el-switch v-model="updateUserData.active" class="ml-[15px] pb-[2px]" size="default"
                           active-text="激活" inactive-text="锁定" inline-prompt width="55"></el-switch>
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
                <div class="flex">
                    <el-form-item label="邮箱">
                        <el-input v-model="updateUserData.email" :disabled="!updateUserData.active"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" class="ml-[30px]">
                        <el-input v-model="updateUserData.phoneNumber"
                                  :disabled="!updateUserData.active"></el-input>
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
                        <el-select class="w-[270px]" v-model="updateUserData.rolesId" collapse-tags
                                   collapse-tags-tooltip :disabled="!updateUserData.active"
                                   :max-collapse-tags="2" multiple>
                            <el-option v-for="role in rolesData" :key="role.id" :label="role.roleName"
                                       :value="role.id"/>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="handleUpdateUser">保存</el-button>
                <el-button @click="editUserDialogVisible=false">取消</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="createUserDialogVisible" width="500" draggable>
            <template #header>
                <el-text tag="b" size="large">创建用户</el-text>
            </template>
            <el-form :model="createUserData" label-position="top">
                <div class="flex">
                    <el-form-item label="用户名">
                        <el-input v-model="createUserData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" class="ml-[20px]">
                        <el-select class="w-[270px]" v-model="createUserData.rolesId" collapse-tags
                                   collapse-tags-tooltip :max-collapse-tags="2" multiple>
                            <el-option v-for="role in rolesData" :key="role.id" :label="role.roleName"
                                       :value="role.id"/>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="handleCreateUser">保存</el-button>
                <el-button @click="createUserDialogVisible=false">取消</el-button>
            </template>
        </el-dialog>
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue"
import {markRaw, reactive, ref} from "vue"
import {useActiveAuthGet, useActiveAuthPost} from "@/utils/active-request.ts"
import type {Role, User} from "@/types/api-types"
import {Delete, Edit, Refresh, User as UserIcon, UserFilled} from "@element-plus/icons-vue"
//@ts-ignore
import {ElMessage, ElMessageBox} from 'element-plus'

// 用户查询
const editUserDialogVisible = ref(false)

const queryUsersData = reactive({
    page: 1,
    pageSize: 1,  // 需要和pagination的设置保持一致
    rolesId: [],
    active: null,
    others: null
})

const {responseData: usersData, activeAuthPost: getUsers} = useActiveAuthPost<{
    total: number,
    users: User[]
}>('/users',
    queryUsersData,
    {
        watchSources: () => [queryUsersData.page, queryUsersData.pageSize],
        watchOptions: {immediate: true}, // 相当于立即执行
        showError: false,
        defaultResponseData: {total: 1} // el-pagination的total初始值必须是一个数字，否则会提示使用了废弃的用法
    }
)

// TODO 角色查询，后期需要修改，提供一个统一的post查询接口
const {responseData: rolesData} = useActiveAuthGet<Role[]>(
    '/roles',
    {
        onMounted: true,
        showError: false
    })

// 更新用户
const updateUserData = reactive({
    id: null,
    username: null,
    email: null,
    phoneNumber: null,
    active: null,
    rolesId: []
})

const {activeAuthPost: updateUser} = useActiveAuthPost(
    '/update-user',
    updateUserData,
)

// 处理编辑事件，传入当前行的索引和用户对象
function handleEditUser(_index: number, row: User): void {
    // 复制当前用户对象，将其角色数组转换为角色ID数组
    const userCopy = {
        ...row,
        rolesId: row.roles.map(role => role.id),
    }
    // 将复制后的用户对象合并到更新用户数据对象中
    Object.assign(updateUserData, userCopy);
    editUserDialogVisible.value = true;
}

// 点击保存按钮，保存用户
async function handleUpdateUser() {
    try {
        await updateUser()
        editUserDialogVisible.value = false
        ElMessage({type: "success", message: "更新成功"})
        await getUsers()
    } catch (error) {
    }
}

// role单元格格式化函数，将返回的role数组转换为字符串
const getRolesString = (_row: any, _column: any, cellValue: Role[]) => {
    return cellValue.map(role => role.roleName).join(",")
}

// 删除用户
const {activeAuthPost: deleteUser} = useActiveAuthPost('/delete-user')

function openDeleteUserMessageBox(userId: number | number[], message: string) {
    if (Array.isArray(userId) && userId.length === 0) {
        ElMessage({type: 'warning', message: '请先选择要删除的用户'})
        return
    }

    ElMessageBox.confirm(message, "删除用户", {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        icon: markRaw(Delete),
        draggable: true,
    }).then(async () => {
        try {
            const counts = await deleteUser({userId})
            ElMessage({type: 'success', message: `成功删除${counts}个用户`})
            await getUsers()
        } catch (error) {
        }
    }).catch(() => {
        ElMessage({type: 'info', message: '取消删除'})
    })
}

// 重置密码
const {activeAuthGet: resetPassword} = useActiveAuthGet('/reset-pass')

function openResetPasswordMessageBox(userId: number) {
    ElMessageBox.confirm("确认要重置该用户的密码吗？", "重置密码", {
        confirmButtonText: "重置",
        cancelButtonClass: "取消",
        type: "warning",
        icon: markRaw(Refresh),
        draggable: true
    }).then(async () => {
        try {
            const initPass = await resetPassword({userId})
            ElMessage({type: 'success', message: `已重置，初始密码为${initPass}，请尽快修改！`})
        } catch (error) {
        }
    }).catch(() => {
        ElMessage({type: 'info', message: '取消重置'})
    })
}

// 批量删除
const usersSelection = ref<number[]>([])

const handleSelectionChange = (rows: User[]) => {
    usersSelection.value = rows.map(row => row.id)
}

// 创建用户
const createUserDialogVisible = ref(false)

const createUserData = reactive({
    username: null,
    rolesId: []
})

const {activeAuthPost: createUser} = useActiveAuthPost('/create-user', createUserData)

async function handleCreateUser() {
    try {
        await createUser()
        createUserDialogVisible.value = false
        ElMessage({type: "success", message: "创建成功"})
        await getUsers()
    }catch (error) {
    }
}
</script>

<style>
.edit-dialog .el-dialog__body {
    padding: 0 20px;
}

.search-label .el-text {
    word-break: keep-all;
    margin-right: 10px;
    margin-left: 5px;
}
</style>
