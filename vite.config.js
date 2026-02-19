import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './dev',
  plugins: [vue()],
  server: {
    port: 5050,
    open: true
  },
  resolve: {
    alias: {
      '@': '../src',
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  build: {
    outDir: '../dev/dist',
    emptyOutDir: true
  }
})
