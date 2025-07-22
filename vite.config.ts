import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/types': resolve(__dirname, './src/types'),
      '@/styles': resolve(__dirname, './src/styles')
    }
  },
  server: {
    port: 3000,
    host: true
  }
})