import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain: viz-korea.ysw.kr
  server: {
    port: 10000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
