import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_BASE = (env.VITE_API_URL || 'http://localhost:2500/api/v1')
  const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API: /api/v1/* -> backend /api/v1/*
        '/api/v1': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
        // Proxy images: /images/* -> backend origin /images/*
        '/images': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
        // Proxy videos: /videos/* -> backend origin /videos/*
        '/videos': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
