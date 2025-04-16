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
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 415) {
            console.error('Content Type Error:', {
                sentContentType: error.config?.headers['Content-Type'],
                data: error.config?.data,
                isFormData: error.config?.data instanceof FormData
            });
        }
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

