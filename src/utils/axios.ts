import axios from 'axios'

export const axiosConfigured = axios.create({
	baseURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}/`
})
