<template>
    <div class="flex h-screen">
        <div class="justify-align-center-[col] flex-grow cyan-gradient">
            <div class="w-2/3 mb-10">
                <div class="text-gray-700 text-3xl mb-1">翼随行短信平台</div>
                <div class="text-gray-400 text-xl">welcome to use sms position system</div>
            </div>
            <el-image class="w-2/3" src="/meeting.svg" fit="contain"></el-image>
        </div>
        <div id="login-container" class="justify-align-center-[col] w-1/3 min-w-[384px]">
            <div class="w-3/4">
                <div class="flex justify-center items-center mb-3">
                    <el-image src="/login-avatar.png" fit="contain" class="mr-1 w-[32px]"/>
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
                        <el-input v-model="loginForm.captcha" size="large" placeholder="请输入验证码"
                                  @keyup.enter="onSubmit(loginFormRef)">
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
                    <el-link type="primary" href="/#/register" :underline="false">点这里注册</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import useSecurity from "@/service/security";
import {v4 as uuidv4} from "uuid"

const loginFormRef = ref<FormInstance>()
let rememberPass = ref<Boolean>(false)
let captchaUrl = ref<String>()

const {getLoginInfo, saveLoginInfo, removeLoginInfo, login, getCaptcha} = useSecurity()

const loginForm = reactive({
    username: "",
    password: "",
    captcha: "",
    uuid: ""
})

const loginFormRules = reactive<FormRules>({
    username: [{required: false, message: "请输入用户名", trigger: "blur"}],
    password: [{required: true, message: "请输入密码", trigger: "blur"}],
    captcha: [{required: true, message: "请输入验证码", trigger: "blur"}],
})

onMounted(async () => {

    // 如果本地保存了用户名密码，则进行填充
    const loginInfo = getLoginInfo()

    if (loginInfo) {
        loginForm.username = loginInfo.username
        loginForm.password = loginInfo.password
        rememberPass.value = true
    }

    try {
        const uuid = uuidv4()
        const captchaBlob = await getCaptcha(uuid)
        captchaUrl.value = URL.createObjectURL(captchaBlob)
    } catch (error) {
        ElMessage({type: "error", message: "验证码获取失败"})
    }

})

async function onSubmit(form: FormInstance | undefined) {
    if (!form) return

    await form.validate(async (valid) => {
        // 需要对无效的情况进行处理，否则会产生一个未捕获的错误向上传播
        if (!valid) return

        // 保存用户名和密码到localStorage
        if (rememberPass.value) {
            saveLoginInfo({
                username: loginForm.username,
                password: loginForm.password
            })
        } else {
            removeLoginInfo()
        }

        // TODO 登陆

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
