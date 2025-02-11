'use client'
import axios from 'axios';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';

let isNotiflixInitialized = false; //define for notiflix


// Base configuration
const Loader_Color = 'rgba(241,230,230,0.985)';

// Notiflix.Loading.init({ svgColor: Loader_Color });
if (typeof window !== 'undefined') {
    if (!isNotiflixInitialized) {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        isNotiflixInitialized = true;
    }
}

// live url 
const apiClient = axios.create({
    baseURL: process.env.baseUrl || 'https://trapi.vouch.club', // Set your API base URL
    timeout: 10000, // Request timeout in milliseconds
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// Request interceptor
// apiClient.interceptors.request.use(
//     (config) => {
//         if (typeof window !== 'undefined') {
//             Notiflix.Loading.standard(); // Show loader
//         }
//         // Add Authorization header or other custom headers
//         const token = getToken(); 
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;

//     },
//     (error) => {
//         // Handle request error
//         return Promise.reject(error);
//     }
// );

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            Notiflix.Loading.standard(); // Show loader
        }
        // Add Authorization header
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Dynamically set Content-Type header
        if (config.data instanceof FormData) {
            // If data is FormData, use 'multipart/form-data'
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            // Default to 'application/json'
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        if (typeof window !== 'undefined') Notiflix.Loading.remove();
        // Return the full response for blob requests
        if (response.config.responseType === 'blob') {
            return response;
        }

        // For other responses, return the data
        return response.data;
    },
    (error) => {
        if (typeof window !== 'undefined') Notiflix.Loading.remove();

        if (!error.response) {
            console.error('Network error: Unable to reach the server.');
        } else if (error.response.status === 401) {
            console.error('Unauthorized access - please log in again.');
        } else if (error.response.status === 500) {
            console.error('Server error: Please try again later.');
        }
        return Promise.reject(error);
    }
);


export default apiClient;









