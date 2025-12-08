import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esto permite que el código use process.env.API_KEY aunque Vite use import.meta.env
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY'
  }
})
