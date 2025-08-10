import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  root: './__tests__',
  server: {
    port: 8088,
    open: '/',
  },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@tzzack/g6-extension-vue': path.resolve(__dirname, './src'),
    }
  }
})
