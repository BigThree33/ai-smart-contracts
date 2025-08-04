import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/api-proxy': {
        target: 'http://new.souhlawfirm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '')
      }
    }
  }
}) 