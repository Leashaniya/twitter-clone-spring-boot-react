import axios from "axios";

// Create the API instance
export const API_BASE_URL = 'http://localhost:5454';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add request interceptor to handle authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle FormData content type
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
        // Remove any existing boundary as axios will set it automatically
        delete config.headers['boundary'];
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Request Config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
    });
    
    return config;
}, (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('jwt');
            window.location.href = '/login';
        }
        
        throw error;
    }
);

