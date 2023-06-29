import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true   // 需要开启https服务
  },
  plugins: [vue(),mkcert()],
})
