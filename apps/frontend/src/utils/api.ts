/**
 * Central API utility for Gene Forge Analyzer
 * Manages the transition between local development and production (Render/Vercel)
 */

export const getApiBaseUrl = () => {
    // In production, VITE_API_URL is the full backend URL
    // In local development, it can be '/api' (for Vite proxy) or 'http://localhost:5000'
    return import.meta.env.VITE_API_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Enhanced fetch wrapper with base URL and default headers
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Request Failed' }));
        throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
};

export default API_BASE_URL;
