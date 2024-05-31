import axios from "axios";

const userInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

userInstance.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
});

export default userInstance;
