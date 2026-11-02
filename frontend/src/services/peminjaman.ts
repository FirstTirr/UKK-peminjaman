import api from '../lib/api';

export interface ItemDetail {
    id_alat: number;
    jumlah: number;
}

export interface PayloadPeminjaman {
    tgl_rencana_kembali: string;
    items: ItemDetail[];
}

export const peminjamanService = {
    async getAll() {
        const response = await api.get('/peminjaman/read');
        return response.data;
    },

    async ajukanPeminjaman(data: PayloadPeminjaman) {
        const response = await api.post('/peminjaman', data);
        return response.data;
    },

    async updateStatus(id_peminjaman: number, status: string) {
        const response = await api.put(`/peminjaman/edit-status/${id_peminjaman}`, { status });
        return response.data;
    },

    async kembalikanAlat(id_peminjaman: number, tgl_kembali_sebenarnya: string) {
        const response = await api.post(`/peminjaman/kembalikan/${id_peminjaman}`, { tgl_kembali_sebenarnya });
        return response.data;
    }
};