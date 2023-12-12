import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'

export default defineConfig({
  plugins: [
    vue(),
    vueSetupExtend(),
    Components({
      resolvers: [VantResolver(),VarletUIResolver()],
    }),
    autoImport({
      resolvers: [VarletUIResolver({ autoImport: true })],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    // 配置 CSS modules 的行为。选项将被传递给 postcss-modules
    modules: {},
    // 内联的 PostCSS 配置（格式同 postcss.config.js）
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5, // 1rem 的大小
          propList: ['*'], // 需要转换的属性，*(全部转换)
          unitPrecision: 6 // 转换精度，保留的小数位数
        })
      ]
    }
  }
})
