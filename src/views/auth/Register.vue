<template>
    <div class="w-screen h-screen cyan-gradient justify-align-center-[col]">
        <div class="flex w-3/4 h-3/4">
            <div class="w-0 flex-grow py-[35px] mr-[35px]">
                <el-image class="w-full h-full" src="/time.svg" fit="contain"></el-image>
            </div>
            <div class="w-[378px] flex flex-col bg-white p-7 shadow">
                <div class="flex justify-between items-center pb-3 mb-5 border-b-2">
                    <el-text tag="b" size="large">用户注册</el-text>
                    <el-text size="small">已注册可
                        <el-text type="primary" size="small">
                            <router-link to="login">直接登录</router-link>
                        </el-text>
                    </el-text>
                </div>
                <div>
                    <el-form ref="registerFormRef" :model="registerData" :rules="registerFormRules" status-icon
                             hide-required-asterisk>
                        <el-form-item class="mb-5" prop="username">
                            <el-input prefix-icon="user" v-model="registerData.username" size="large"
                                      placeholder="请输入用户名"/>
                        </el-form-item>
                        <el-form-item prop="password1">
                            <el-input prefix-icon="lock" v-model="registerData.password1" size="large"
                                      placeholder="密码由8-20位大小写字母，数字和字符组合" show-password/>
                        </el-form-item>
                        <el-form-item prop="password2">
                            <el-input prefix-icon="lock" v-model="registerData.password2" size="large"
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus"
import {useRegister} from "@/service/auth-service";
import {showErrorMessage} from "@/service/error-helper";
import {useRouter} from "vue-router";

const {registerData, register} = useRegister('/register', {name: 'login'})
const registerFormRef = ref<FormInstance>()
let readPolicy = ref<Boolean>(false)
const router = useRouter()

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
    } else if (value !== registerData.value.password1) {
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
            ElMessage({type: "warning", message: "请先阅读并勾选相关政策"})
            return
        }

        // 注册成功则跳转到登录页面
        try {
            await register()
            ElMessage.success("注册成功，请登陆")
        } catch (error) {
            showErrorMessage(error)
        }
    })
}
</script>
