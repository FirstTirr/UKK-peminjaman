import api from '../lib/api';

export const authService = {
    async login(username: string, password: string) {
        // Sesuaikan endpoint ini dengan rute backend kamu (/auth/login atau /login)
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    async logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
};