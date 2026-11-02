import api from '@/src/lib/api';

export const alatService = {
    async getAll() {
        const response = await api.get('/alat');
        return response.data;
    },
    async create(data: { nama_alat: string; stok: number; harga_perhari?: number; id_kategori: number }) {
        const response = await api.post('/alat', data);
        return response.data;
    },
    async update(id: number, data: { nama_alat: string; stok: number; harga_perhari?: number; id_kategori: number }) {
        const response = await api.put(`/alat/${id}`, data);
        return response.data;
    },
    async delete(id: number) {
        const response = await api.delete(`/alat/${id}`);
        return response.data;
    }
};