import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            // 自动导入vue,vue-route时，webstorm比较慢，而且虽然不影响实际实际，但是会报错
            imports: [],
            resolvers: [
                // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                ElementPlusResolver(),
            ],
            dts: path.resolve(pathSrc, 'auto-imports.d.ts')
        }),
        Components({
            resolvers: [
                // 自动导入Element Plus组件
                ElementPlusResolver(),
                // 自动导入图标组件,prefix大小写无所谓
                IconsResolver({
                    prefix: 'Icon',
                })
            ],
            dts: path.resolve(pathSrc, 'components.d.ts')
        }),
        Icons({
            autoInstall: true,
        }),
    ],
    resolve: {
        // 导入的时候，就可以不再写后缀，但是webstorm会报错。
        extensions: ['.js', '.ts', '.json', '.vue', '.jsx', '.tsx'],
        // 导入时可以使用@做为/src的别名
        alias: {
            '@': pathSrc
        }
    }
})
