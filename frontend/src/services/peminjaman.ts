import api from '../lib/api';

export interface ItemDetail {
    id_alat: number;
    jumlah: number;
}

export type StatusPeminjaman = 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Dipinjam' | 'Selesai';

export interface ItemPeminjaman extends ItemDetail {
    id_detail: number;
    nama_alat: string;
    total_harga: number | string;
}

export interface Peminjaman {
    id_peminjaman: number;
    id_user: number;
    id_petugas: number | null;
    username: string;
    nama_petugas: string | null;
    tgl_pinjam: string;
    tgl_rencana_kembali: string;
    status: StatusPeminjaman;
    created_at: string;
    items: ItemPeminjaman[];
}

export interface PayloadPeminjaman {
    tgl_pinjam: string;
    tgl_rencana_kembali: string;
    items: ItemDetail[];
}

export const peminjamanService = {
    // Khusus Admin / Petugas (Melihat seluruh data)
    async getAll(): Promise<Peminjaman[]> {
        const response = await api.get('/peminjaman/read');
        return response.data;
    },

    // Khusus Peminjam (Mengambil data peminjaman dari database)
    async getRiwayatPeminjam(): Promise<Peminjaman[]> {
        const response = await api.get('/peminjaman/read');
        return response.data;
    },

    async ajukanPeminjaman(data: PayloadPeminjaman) {
        const response = await api.post('/peminjaman', data);
        return response.data;
    },

    async updateStatus(id_peminjaman: number, status: StatusPeminjaman) {
        const response = await api.put(`/peminjaman/edit/status/${id_peminjaman}`, { status });
        return response.data;
    },

    async kembalikanAlat(id_peminjaman: number, tgl_kembali_sebenarnya: string) {
        const response = await api.post(`/peminjaman/kembalikan/${id_peminjaman}`, { tgl_kembali_sebenarnya });
        return response.data;
    }
};
