import axios from "axios";
import { toast } from 'react-hot-toast';

const adminToken = localStorage.getItem('adminToken')

const adminInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

adminInstance.interceptors.request.use((config) => {
    console.log(config);
    if(adminToken){
        config.headers.Authorization = `Bearer ${adminToken}`
    }
    return config
},
(error) => {
    return Promise.reject(error)
})

adminInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        if (error.response.status === 401) {
          toast.error("Unauthorized. Check your authentication credentials.");
        } else {
          // toast.error(error.response.data.message || "Error submitting form.");
          toast.error(error.response.data.message);
        }
      } else if (error.request) {
        console.error("Request Error:", error.request);
        toast.error("No response received from the server.");
      } else {
        console.error("Error:", error.message);
        toast.error("An error occurred.");
      }
      return Promise.reject(error);
    }
  );

  export default adminInstance