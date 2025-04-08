import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // Ensure the output directory is set to 'dist'
    rollupOptions: {
      input: 'index.html', // Entry point for the app
    },
  },
  base: './', // Ensures relative paths for assets in production
})
