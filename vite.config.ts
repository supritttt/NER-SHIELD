import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/textbee': {
        target: 'https://api.textbee.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/textbee/, '/api/v1/gateway')
      }
    }
  }
})
