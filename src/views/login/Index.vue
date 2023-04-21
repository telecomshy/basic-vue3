<template>
    <div class="flex h-screen">
        <div class="flex flex-col justify-center bg-gradient-to-b from-myCyan to-myCyan-light">
            <div class="mb-6">
                <div class="text-gray-700 text-3xl mb-1">翼随行短信平台</div>
                <div class="text-gray-400 text-xl">welcome to use sms position system</div>
            </div>
            <el-image class="w-[750px]" src="/login-bg.svg" fit="contain"></el-image>
        </div>
        <div class="flex flex-col justify-center bg-yellow-100">
            <div class="flex justify-center items-center">
                <el-image src="/account-logo.png" fit="contain" class="w-[32px]" />
                <span>用户登陆</span>
            </div>
            <el-form :model="form" label-position="top" hide-required-asterisk>
                <el-form-item label="用户名：" required>
                    <el-input v-model="form.username" size="large" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码：" required>
                    <el-input v-model="form.password" size="large" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="验证码：" required>
                    <el-input v-model="form.captcha" size="large" placeholder="请输入验证码" />
                    <el-image :src="captchaUrl" alt="" @click="getCaptcha" class="pointer" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
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

interface LoginForm {
    username: String,
    password: String,
    captcha: String,
    uuid: String
}

const form: LoginForm = reactive({
    username: "",
    password: "",
    captcha: "",
    uuid: ""
})

let captchaUrl = ref("")

// 从后端获取验证码
async function getCaptcha() {
    form.uuid = uuidv4()
    const response = await $axios({
        method: "get",
        url: "/captcha",
        params: { uuid: form.uuid },
        responseType: "blob"
    })
    captchaUrl.value = URL.createObjectURL(response.data)
}

onMounted(async () => {
    await getCaptcha()
})

const onSubmit = async () => {
    const authStore = useAuthStore()
    try {
        await authStore.login(form)
    } catch (error) {
        // 如果用户名、密码或者验证码不对，统一返回401错误，另外，如果用户名和密码为空，会返回422错误，422统一由拦截器处理
        if (isAxiosError(error) && error?.response) {
            const { status, data } = error.response
            if (status === 401) {
                alert(data["detail"])
            }
        }
    }
}
</script>

<style scoped>
.right {
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 80px;
    margin: 0 auto;
}

.right-title {
    text-align: center;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
}

.right-title-img {
    width: 32px;
    margin-right: 8px;
}
</style>
