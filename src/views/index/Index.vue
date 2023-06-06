<template>
    <my-main>
        <template #header>
            <span>{{route.meta.label}}</span>
        </template>

        hello world
    </my-main>
</template>

<script setup lang="ts">
import MyMain from "@/components/layout/MyMain.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>
