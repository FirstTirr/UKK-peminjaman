import api from '@/src/lib/api';

export interface Alat {
    id_alat: number;
    nama_alat: string;
    id_kategori: number;
    nama_kategori: string;
    stok: number;
    deskripsi?: string | null;
    harga_perhari: number | string;
}

export interface AlatPayload {
    nama_alat: string;
    stok: number;
    harga_perhari?: number;
    id_kategori: number;
}

export const alatService = {
    async getAll(): Promise<Alat[]> {
        const response = await api.get('/alat');
        return response.data;
    },
    async create(data: AlatPayload) {
        const response = await api.post('/alat', data);
        return response.data;
    },
    async update(id: number, data: AlatPayload) {
        const response = await api.put(`/alat/${id}`, data);
        return response.data;
    },
    async delete(id: number) {
        const response = await api.delete(`/alat/${id}`);
        return response.data;
    }
};
