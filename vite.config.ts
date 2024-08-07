import { defineConfig } from 'vite'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE_URL || '/'
  const config = {
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    plugins: [vue({ ...templateCompilerOptions })]
  }

  if (mode === 'lib') {
    Object.assign(config, {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/lib/main.ts'),
          name: 'encase',
          fileName: 'encase'
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
  }

  return config
})
