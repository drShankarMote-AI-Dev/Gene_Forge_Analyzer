/**
 * Central API utility for Gene Forge Analyzer
 * Manages the transition between local development and production (Render/Vercel)
 */

export const getApiBaseUrl = () => {
    // Priority: VITE_API_BASE_URL > VITE_API_URL > default /api
    return import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Enhanced fetch wrapper with base URL and default headers
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    // Hybrid Auth: Check for token in localStorage (fallback for cross-domain cookie blocking)
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token && token !== 'undefined' && token !== 'null') {
        // Validate JWT format (basic check: 3 parts)
        if (token.split('.').length === 3) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (headers as any)['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn("Invalid JWT token format found in localStorage. Clearing.");
            localStorage.removeItem('access_token');
        }
    }

    const response = await fetch(url, {
        ...options,
        // Ensure credentials (cookies) are sent for cross-domain requests in production
        credentials: 'include',
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Request Failed' }));
        throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
};

export default API_BASE_URL;
