import { defineConfig } from 'vite'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  plugins: [vue({ ...templateCompilerOptions })],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'VueEnclose',
      fileName: 'vue-enclose'
    },
    rollupOptions: {
      external: ['vue', 'three'],
      output: {
        globals: {
          vue: 'Vue',
          three: 'Three'
        }
      }
    }
  }
})
