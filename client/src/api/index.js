import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

// Handle all configuration of request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Или из кук/стора (redux, zustand)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;