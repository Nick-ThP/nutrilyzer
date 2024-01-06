import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': process.env.VITE_API_URL
		}
	}
})
