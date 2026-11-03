import api from '@/src/lib/api';

export type UserRole = 'admin' | 'petugas' | 'peminjam';

export interface User {
    id_user: number;
    username: string;
    role: UserRole;
    no_hp: string | null;
    alamat: string | null;
    created_at: string;
    password?: string;
}

export interface UserPayload {
    username: string;
    password?: string;
    role: UserRole;
    no_hp?: string;
    alamat?: string;
}

export const userService = {
    async getAll(): Promise<User[]> {
        const response = await api.get('/user/read');
        return response.data;
    },
    async create(data: UserPayload) {
        const response = await api.post('/user', data);
        return response.data;
    },
    async update(id: number, data: UserPayload) {
        const response = await api.put(`/user/edit/${id}`, data);
        return response.data;
    },
    async delete(id: number) {
        const response = await api.delete(`/user/delete/${id}`);
        return response.data;
    }
};
