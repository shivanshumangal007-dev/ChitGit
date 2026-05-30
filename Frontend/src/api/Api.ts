import axios from "axios";

const api = axios.create({
	// baseURL: "http://localhost:8000",
	baseURL: "https://chitgit-2.onrender.com",
	// baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `bearer ${token}`;
	}
	return config;
});
export default api;
