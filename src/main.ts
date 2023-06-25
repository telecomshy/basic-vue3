import {createApp} from 'vue'
import App from '@/App.vue'
import {createPinia} from 'pinia'
import {router} from '@/router'
import "element-plus/dist/index.css"
import "@/style.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {isError} from "@/utils/utils.ts";

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 注册element-plus图标组件，也可以直接导入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia).use(router)

app.config.errorHandler = (error) => {
    if (isError(error)) {
        console.warn(error.message)
    } else {
        console.warn(error)
    }
}

app.mount("#app")
