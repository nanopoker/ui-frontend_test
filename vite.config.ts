import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repository name from environment or default to empty (root)
const repoName = process.env.GITHUB_REPOSITORY_NAME || 'ui-frontend_test'
const basePath = process.env.GITHUB_PAGES ? `/${repoName}/` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

