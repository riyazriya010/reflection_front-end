import axios from 'axios';
import { BACKEND_PORT } from './constance';

const axiosInstance = axios.create({
    baseURL: `${BACKEND_PORT}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export default axiosInstance;
