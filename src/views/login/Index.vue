<template>
    <el-card shadow="never" class="login-card">
        <el-form :model="form" label-width="80px" label-position="left">
            <el-form-item label="用户名：">
                <el-input v-model="form.username"/>
            </el-form-item>
            <el-form-item label="密码：">
                <el-input v-model="form.password"/>
            </el-form-item>
            <el-form-item label="验证码：">
                <el-input v-model="form.captcha"/>
                <el-image :src="captchaUrl" alt="" @click="getCaptcha"/>
            </el-form-item>
            <el-form-item>
                <el-button type="text" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import {reactive, onMounted, ref} from "vue";
import {useAuthStore} from "@/store/auth";
import {isAxiosError} from "axios";
import {v4 as uuidv4} from "uuid"
import {$axios} from "@/utils/request";

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
        params: {uuid: form.uuid},
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
            const {status, data} = error.response
            if (status === 401) {
                alert(data["detail"])
            }
        }
    }
}
</script>

<style scoped>
.login-card {
    width: 360px;
    margin: auto;
}
</style>
