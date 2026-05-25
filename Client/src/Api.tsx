import axios from "axios";

const api = axios.create({
	// baseURL: "http://localhost:8000",
	baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
