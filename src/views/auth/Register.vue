<template>
    <div class="w-screen h-screen cyan-gradient justify-align-center-[col]">
        <div class="flex w-2/3 h-2/3">
            <div class="w-0 flex-grow p-[30px]">
                <el-image class="w-full h-full" src="/time.svg" fit="contain"></el-image>
            </div>
            <div class="w-[380px] flex flex-col bg-white p-[30px]">
                <div class="flex justify-between items-center pb-3 mb-5 border-b-2">
                    <el-text tag="b" size="large">用户注册</el-text>
                    <el-text size="small">已注册可
                        <el-text type="primary" size="small">
                            <router-link to="login">直接登录</router-link>
                        </el-text>
                    </el-text>
                </div>
                <div>
                    <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules"
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
                        <el-form-item class="read-policy-checkbox">
                            <el-checkbox v-model="readPolicy">
                                <el-text size="small" class="whitespace-pre-line">我已阅读并遵守以下条款:
                                    <router-link to="" class="text-[#409eff] hover:text-blue-500">
                                        《中华人民共和国数据信息安全保护法》
                                    </router-link>
                                </el-text>
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="w-full" type="primary" size="large" auto-insert-space>立即注册</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";

const loginFormRef = ref<FormInstance>()

const registerForm = reactive({
    username: "",
    password1: "",
    password2: ""
})

const registerFormRules = reactive<FormRules>({
    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
    password1: [{required: true, message: "请输入密码", trigger: "blur"}],
    password2: [{required: true, message: "请再次输入密码", trigger: "blur"}],
})

let readPolicy = ref<Boolean>(false)
</script>

<style scoped>

</style>
