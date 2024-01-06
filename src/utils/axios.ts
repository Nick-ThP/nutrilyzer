import axios from 'axios'

export const axiosConfigured = axios.create({
	baseURL: `http://localhost:${import.meta.env.VITE_API_URL}/`
})
