import axios from 'axios';
import { getToken } from '@/lib/utils';


const apiClientOrder = axios.create({
    baseURL: process.env.baseUrl_OrderTracking || 'https://ordertracking.almonds.ai/api', // Set your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClientOrder.interceptors.request.use(
    (config) => {
        // Notiflix.Loading.standard() // show loader --
        // Add Authorization header or other custom headers
        const token = getToken(); // Replace with your token retrieval logic
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);


apiClientOrder.interceptors.response.use(
    (response) => {
        // Notiflix.Loading.remove()

        // Process and return response data
        return response.data;

    },
    (error) => {
        // Notiflix.Loading.remove()
        // Handle response errors
        if (error.response?.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            console.error('Unauthorized access - please log in again.');
        }
        return Promise.reject(error);
    }
);


export default apiClientOrder;