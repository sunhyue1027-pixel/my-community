import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 저장소 이름과 동일하게 base 경로 설정
export default defineConfig({
  plugins: [react()],
  base: '/my-community/',
})
