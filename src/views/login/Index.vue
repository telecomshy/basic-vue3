<template>
    <div class="flex h-screen">
        <div class="justify-align-center-[col] flex-grow bg-gradient-to-b from-[#e2e8f6] to-[#f1f6fc]">
            <div class="w-[750px] mb-6">
                <div class="text-gray-700 text-3xl mb-1">翼随行短信平台</div>
                <div class="text-gray-400 text-xl">welcome to use sms position system</div>
            </div>
            <el-image class="w-[750px]" src="/login-bg.svg" fit="contain"></el-image>
        </div>
        <div id="login-container" class="justify-align-center-[col] w-[480px]">
            <div class="flex items-center mb-3">
                <el-image src="/account-logo.png" fit="contain" class="mr-1 w-[32px]" />
                <span>用户登陆</span>
            </div>
            <el-form ref="loginFormRef" class="w-3/4" :model="loginForm" :rules="loginFormRules" label-position="top"
                hide-required-asterisk>
                <el-form-item label="用户名：" prop="username" required>
                    <el-input v-model="loginForm.username" size="large" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码：" prop="password" required>
                    <el-input v-model="loginForm.password" size="large" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="验证码：" prop="captcha" required>
                    <el-input v-model="loginForm.captcha" size="large" placeholder="请输入验证码" />
                    <el-image :src="captchaUrl" alt="" @click="getCaptcha" class="pointer" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(loginFormRef)">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { isAxiosError } from "axios";
import { v4 as uuidv4 } from "uuid"
import { $axios } from "@/utils/request";
import type { FormInstance, FormRules } from 'element-plus'

const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
    username: "",
    password: "",
    captcha: "",
    uuid: ""
})

const loginFormRules = reactive<FormRules>({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
})

let captchaUrl = ref("")

// 从后端获取验证码
async function getCaptcha() {
    loginForm.uuid = uuidv4()
    const response = await $axios({
        method: "get",
        url: "/captcha",
        params: { uuid: loginForm.uuid },
        responseType: "blob"
    })
    captchaUrl.value = URL.createObjectURL(response.data)
}

onMounted(async () => {
    await getCaptcha()
})

// TODO undefined是必须的吗？
const onSubmit = async (form: FormInstance | undefined) => {
    if (!form) return

    await form.validate(async (valid, fields) => {
        if (valid) {
            const authStore = useAuthStore()
            try {
                await authStore.login(loginForm)
            } catch (error) {
                // 如果用户名、密码或者验证码不对，统一返回401错误，另外，如果用户名和密码为空，会返回422错误，422统一由拦截器处理
                if (isAxiosError(error) && error?.response) {
                    const { status, data } = error.response
                    if (status === 401) {
                        // TODO 在合适的地方显示登陆错误消息
                        alert(data["detail"])
                    }
                }
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style>
#login-container .el-form-item__error {
    position: absolute;
    left: auto;
    right: 0;
    top: -27px;
}
</style>