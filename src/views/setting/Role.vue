<template>
    <the-main>
        {{ responseData }}
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";

import {authRequest} from "@/service/request-service.ts";

const {responseData} = authRequest.useActivePost(
    '/users',
    {page: 1, pageSize: 10},
    {onMounted: true}
)
</script>

<style scoped>

</style>
