import api from '@/src/lib/api';

export const kategoriService = {
    async getAll() {
        // Wajib /kategori/read karena di backend menggunakan router.get('/read', ...)
        const response = await api.get('/kategori/read');
        return response.data;
    },
    async create(nama_kategori: string) {
        const response = await api.post('/kategori', { nama_kategori });
        return response.data;
    },
    async update(id_kategori: number, nama_kategori: string) {
        // Wajib /kategori/edit/:id sesuai backend router.put('/edit/:id', ...)
        const response = await api.put(`/kategori/edit/${id_kategori}`, { nama_kategori });
        return response.data;
    },
    async delete(id_kategori: number) {
        // Wajib /kategori/delete/:id sesuai backend router.delete('/delete/:id', ...)
        const response = await api.delete(`/kategori/delete/${id_kategori}`);
        return response.data;
    }
};