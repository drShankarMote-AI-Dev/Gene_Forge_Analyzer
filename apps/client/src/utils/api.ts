/**
 * Central API utility for Gene Forge Analyzer
 * Manages the transition between local development and production (Render/Vercel)
 */

export const getApiBaseUrl = () => {
    // Priority 1: Environment variable (usually set in .env or Render/Vercel dashboard)
    const envUrl = import.meta.env.VITE_API_URL;

    if (envUrl && envUrl.startsWith('http')) {
        return envUrl;
    }

    // Priority 2: Relative path for proxied development (Vite)
    if (envUrl === '/api') {
        return envUrl;
    }

    // Fallback for local development
    return 'http://localhost:5000/api';
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
