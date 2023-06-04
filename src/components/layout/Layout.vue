<template>
    <el-container class="h-full">
        <el-header height="70px" class="bg-amber-200">
            Header
        </el-header>
        <el-container>
            <el-aside width="200px" class="bg-[#e8edf1]">
                <el-menu active-text-color="#dde4ea" background-color="#e8edf1">
                    <el-menu-item index="1">
                        <el-icon>
                            <setting/>
                        </el-icon>
                        <span>系统首页</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <location/>
                            </el-icon>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item index="1-1">用户管理</el-menu-item>
                        <el-menu-item index="1-2">角色管理</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu-scopes>
                        <template #title>
                            <el-icon>
                                <location/>
                            </el-icon>
                            <span>子菜单</span>
                        </template>
                        <el-menu-item-scopes require-scopes="role">测试菜单1</el-menu-item-scopes>
                        <el-menu-item-scopes require-scopes="user">测试菜单2</el-menu-item-scopes>
                    </el-sub-menu-scopes>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>


                <el-button @click="author.books.push('vue-4')">add</el-button>
                <el-button @click="author.books.pop()">minus</el-button>
                <el-button @click="author={books: ['1', '2', '3', '4']}">change</el-button>
                <p>Has published books:</p>
                <p>{{ author.books}}</p>
                <p>{{ publishedBooksMessage }}</p>
                <p>{{ calculateBooksMessage() }}</p>

            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import {Location, Setting} from "@element-plus/icons-vue";
import ElMenuItemScopes from "@/components/menu/ElMenuItemScopes.vue";
import ElSubMenuScopes from "@/components/menu/ElSubMenuScopes.vue";
import { reactive, computed, ref } from 'vue'

const author = ref({
    books: [
        'Vue 1',
        'Vue 2',
        'Vue 3'
    ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
    return author.value.books.length <= 3 ? '小于等于3本' : '大于3本'
})

function calculateBooksMessage() {
    return author.value.books.length <= 3 ? '小于等于3本' : '大于3本'
}
</script>

