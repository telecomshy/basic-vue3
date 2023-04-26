<template>
    <div class="flex h-screen">
        <div class="justify-align-center-[col] flex-grow bg-gradient-to-b from-[#e2e8f6] to-[#f1f6fc] min-w-[640px]">
            <div class="w-2/3 mb-6">
                <div class="text-gray-700 text-3xl mb-1">翼随行短信平台</div>
                <div class="text-gray-400 text-xl">welcome to use sms position system</div>
            </div>
            <el-image class="w-2/3" src="/login-bg.svg" fit="contain"></el-image>
        </div>
        <div id="login-container" class="justify-align-center-[col] w-1/3 min-w-[384px]">
            <div class="w-3/4">
                <div class="flex justify-center items-center mb-3">
                    <el-image src="/account-logo.png" fit="contain" class="mr-1 w-[32px]"/>
                    <span class="text-xl">用户登陆</span>
                </div>
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-position="top"
                         hide-required-asterisk>
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="loginForm.username" size="large" placeholder="请输入用户名"/>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="loginForm.password" size="large" placeholder="请输入密码" show-password/>
                    </el-form-item>
                    <el-form-item id="captcha" label="验证码：" prop="captcha">
                        <el-input v-model="loginForm.captcha" size="large" placeholder="请输入验证码">
                            <template #append>
                                <el-image class="h-[38px]" :src="captchaUrl" alt="" @click="getCaptcha"/>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="flex w-full justify-between">
                            <el-checkbox v-model="rememberPass" label="记住密码" size="large"/>
                            <el-link type="primary" :underline="false">忘记密码</el-link>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="w-full" type="primary" @click="onSubmit(loginFormRef)" size="large"
                                   auto-insert-space>登录
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="flex w-full justify-center text-sm text-gray-600">
                    <span>还没有账号？</span>
                    <el-link type="primary" href="/#/index" :underline="false">点这里注册</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useAuthStore} from "@/store/auth";
import {v4 as uuidv4} from "uuid"
import {$axios} from "@/utils/request";
import type {FormInstance, FormRules} from 'element-plus'
import {Base64} from "js-base64";

const loginFormRef = ref<FormInstance>()
let rememberPass = ref<Boolean>(false)
let captchaUrl = ref<String>()

const loginForm = reactive({
    username: "",
    password: "",
    captcha: "",
    uuid: ""
})

const loginFormRules = reactive<FormRules>({
    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
    password: [{required: true, message: "请输入密码", trigger: "blur"}],
    captcha: [{required: true, message: "请输入验证码", trigger: "blur"}],
})

// 从后端获取验证码函数
async function getCaptcha() {
    try {
        loginForm.uuid = uuidv4()
        const response = await $axios({
            method: "get",
            url: "/captcha",
            params: {uuid: loginForm.uuid},
            responseType: "blob"
        })
        captchaUrl.value = URL.createObjectURL(response.data)
    } catch (error) {
        console.log("获取验证码失败", error)
    }
}

// 挂载时获取验证码，如果保存了用户名密码，则进行填充
onMounted(async () => {
    await getCaptcha()
    const user = localStorage.getItem("user")
    if (user) {
        loginForm.username = user
        loginForm.password = Base64.decode(localStorage.getItem("pass") || "")
        rememberPass.value = true
    }
})

// TODO undefined是必须的吗？
const onSubmit = async (form: FormInstance | undefined) => {
    if (!form) return

    await form.validate(async (valid, fields) => {
        if (valid) {
            // 如果勾选了记住密码，则保存用户名和密码到localStorage
            if (rememberPass.value) {
                localStorage.setItem("user", loginForm.username)
                localStorage.setItem("pass", Base64.encode(loginForm.password))
            } else {
                localStorage.removeItem("user")
                localStorage.removeItem("pass")
            }

            // 登陆
            const authStore = useAuthStore()
            await authStore.login(loginForm)
        }else{
            console.log("数据验证失败", fields)
        }
    })
}
</script>

<style>
#login-container .el-form-item__error {
    position: absolute;
    left: auto;
    right: 0;
    top: -25px;
}

#captcha .el-input-group__append {
    padding: 0 3px;
}
</style>
