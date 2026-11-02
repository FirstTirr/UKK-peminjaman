import api from '@/src/lib/api';

export const userService = {
    async getAll() {
        // Sesuaikan endpoint ini dengan backend userRoute.js kamu (misal: '/users/read' atau tetap '/users')
        const response = await api.get('/users/read'); 
        return response.data;
    },
    async create(data: { username: string; password?: string; role: string; no_hp?: string; alamat?: string }) {
        const response = await api.post('/users', data);
        return response.data;
    },
    async update(id: number, data: { username: string; password?: string; role: string; no_hp?: string; alamat?: string }) {
        // Sesuaikan jika menggunakan '/users/edit/' di backend
        const response = await api.put(`/users/edit/${id}`, data); 
        return response.data;
    },
    async delete(id: number) {
        // Sesuaikan jika menggunakan '/users/delete/' di backend
        const response = await api.delete(`/users/delete/${id}`); 
        return response.data;
    }
};