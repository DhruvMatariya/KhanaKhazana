import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const allowedHosts = [
  'localhost',
  '127.0.0.1',
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.VITE_ALLOWED_HOST,
].filter(Boolean)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts,
  },
  preview: {
    allowedHosts,
  },
})
