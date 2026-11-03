import api from '@/src/lib/api';

export interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

export const kategoriService = {
    async getAll(): Promise<Kategori[]> {
        const response = await api.get('/kategori/read');
        return response.data;
    },
    async create(nama_kategori: string) {
        const response = await api.post('/kategori', { nama_kategori });
        return response.data;
    },
    async update(id_kategori: number, nama_kategori: string) {
        const response = await api.put(`/kategori/edit/${id_kategori}`, { nama_kategori });
        return response.data;
    },
    async delete(id_kategori: number) {
        const response = await api.delete(`/kategori/delete/${id_kategori}`);
        return response.data;
    }
};
