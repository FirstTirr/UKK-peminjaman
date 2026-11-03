import api from '@/src/lib/api';
import { StatusPeminjaman } from './peminjaman';

export interface Pengembalian {
    id_pengembalian: number;
    id_peminjaman: number;
    peminjam: string;
    tgl_rencana_kembali: string;
    tgl_kembali_sebenarnya: string;
    denda: number | string;
    total_pembayaran: number | string;
    status: StatusPeminjaman;
}

export const laporanService = {
    async getPengembalian(): Promise<Pengembalian[]> {
        const response = await api.get('/laporan/pengembalian');
        return response.data;
    }
};
