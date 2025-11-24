import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xingchuan-course-web/',   // 🚀 This line is required for GitHub Pages!
})
