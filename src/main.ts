import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import "element-plus/dist/index.css"
import "./style.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(({store})=>{
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = ()=>{
        store.$state = JSON.parse(JSON.stringify(initialState));
    }
})

// 注册element-plus图标组件，也可以直接导入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia).use(router)

app.mount("#app")
