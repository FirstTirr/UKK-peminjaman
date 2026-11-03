import api from '../lib/api';

export interface RegisterPayload {
    username: string;
    password: string;
    no_hp: string;
    alamat: string;
}

interface LoginResponse {
    token: string;
    role: 'admin' | 'petugas' | 'peminjam';
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    async register(data: RegisterPayload) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
        }
    }
};
