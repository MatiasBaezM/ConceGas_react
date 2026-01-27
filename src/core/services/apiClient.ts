/**
 * API Client Utility
 * 
 * Este archivo centraliza las peticiones al backend.
 * Cuando implementes tu base de datos y API real, solo debes cambiar la BASE_URL
 * y este cliente se encargará de incluir automáticamente el token de autenticación
 * en todas las peticiones protegidas.
 */

const BASE_URL = 'http://localhost:3000/api'; // Cambiar por tu URL de API real cuando esté lista

export const apiClient = {
    /**
     * Obtiene el token guardado en localStorage
     */
    getToken: () => {
        const user = localStorage.getItem('concegas_user');
        if (user) {
            const parsed = JSON.parse(user);
            return parsed.token || null;
        }
        return null;
    },

    /**
     * Helper para peticiones GET
     */
    get: async (endpoint: string) => {
        const token = apiClient.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Helper para peticiones POST
     */
    post: async (endpoint: string, data: unknown) => {
        const token = apiClient.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Puedes añadir put, delete, etc. siguiendo el mismo patrón
};
