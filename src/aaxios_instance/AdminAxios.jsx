import axios from "axios";

const adminInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

adminInstance.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
});

export default adminInstance;
