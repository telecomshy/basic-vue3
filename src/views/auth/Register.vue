<template>
    <RegisterLayout image="/time.svg">
        <div class="flex justify-between items-center pb-3 mb-5 border-b-2">
            <el-text tag="b" size="large">用户注册</el-text>
            <el-text size="small">已注册可
                <el-text type="primary" size="small">
                    <router-link to="login">直接登录</router-link>
                </el-text>
            </el-text>
        </div>
        <div>
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" status-icon
                     hide-required-asterisk>
                <el-form-item class="mb-5" prop="username">
                    <el-input prefix-icon="user" v-model="registerForm.username" size="large"
                              placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item prop="password1">
                    <el-input prefix-icon="lock" v-model="registerForm.password1" size="large"
                              placeholder="密码由8-20位大小写字母，数字和字符组合" show-password/>
                </el-form-item>
                <el-form-item prop="password2">
                    <el-input prefix-icon="lock" v-model="registerForm.password2" size="large"
                              placeholder="请再次输入密码" show-password/>
                </el-form-item>
                <el-form-item class="read-policy-checkbox py-1.5">
                    <el-checkbox v-model="readPolicy">
                        <el-text size="small" class="whitespace-pre-line leading-snug">我已阅读并遵守以下条款:
                            <router-link to="" class="text-[#409eff] hover:text-blue-500">
                                《中华人民共和国数据安全保护法》
                            </router-link>
                        </el-text>
                    </el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button class="w-full" type="primary" size="large" auto-insert-space
                               @click="onSubmit(registerFormRef)">立即注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </RegisterLayout>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {requestApi} from "@/utils/request";
import {router} from "@/router"

const registerFormRef = ref<FormInstance>()
let readPolicy = ref<Boolean>(false)

const registerForm = reactive({
    username: "",
    password1: "",
    password2: ""
})

function checkUsername(rule: any, value: string, callback: (error?: string) => void) {
    if (value === "") {
        callback("用户名不能为空")
    } else if (value.length < 6 || value.length > 20) {
        callback("用户名必须大于6小于20个字符")
    } else {
        callback()
    }
}

function checkPass1(rule: any, value: string, callback: (error?: string) => void) {
    if (value === "") {
        return callback("密码不能为空")
    }
    const passPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[!@#$%^&*._-]).{8,}$/
    if (!passPattern.test(value)) {
        return callback("密码必须大于8个字符且包含大小写字母，数字和特殊字符")
    }
    callback()
}

function checkPass2(rule: any, value: string, callback: (error?: string) => void) {
    if (value === "") {
        callback("密码不能为空")
    } else if (value !== registerForm.password1) {
        callback("两次输入不一致")
    } else {
        callback()
    }
}

const registerFormRules = reactive<FormRules>({
    username: [{validator: checkUsername, trigger: "blur"}],
    password1: [{validator: checkPass1, trigger: "blur"}],
    password2: [{validator: checkPass2, trigger: "blur"}],
})

async function onSubmit(form: FormInstance | undefined) {
    if (!form) return

    await form.validate(async (valid) => {
        // 需要对无效的情况进行处理，否则会产生一个未捕获的错误向上传播
        if (!valid) return

        // 检查是否勾选同意条款
        if (!readPolicy.value) {
            return ElMessage({message: "请先阅读并勾选相关政策", type: "warning"})
        }

        // 登陆
        const [error] = await requestApi({
            method: "post",
            url: "/register",
            data: registerForm
        })

        if (error) {
            ElMessage({message: `注册失败：${error.detail}`, type: "error"})
        } else {
            ElMessage({message: "注册成功", type: "success"})
            await router.push({path: "/login"})
        }
    })
}
</script>

<style scoped>

</style>
