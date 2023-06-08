import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
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
        // 导入的时候，就可以不再写后缀，但是webstorm会报错，不要加入vue后缀，会导致IDE识别问题。
        extensions: ['.js', '.ts', '.json', '.jsx', '.tsx'],
        // 导入时可以使用@做为/src的别名
        alias: {
            '@': pathSrc
        }
    }
})
