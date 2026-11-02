const db = require('../config/db');

const PeminjamanModel = {
    async getAll() {
        const [rows] = await db.query(`
            SELECT p.*, u.username AS peminjam, pt.username AS nama_petugas 
            FROM peminjaman p
            JOIN user u ON p.id_user = u.id_user
            LEFT JOIN user pt ON p.id_petugas = pt.id_user
            ORDER BY p.created_at DESC
        `);
        return rows;
    },
    async createHeader(id_user, tgl_pinjam, tgl_rencana_kembali) {
        const [result] = await db.query(
            'INSERT INTO peminjaman (id_user, tgl_pinjam, tgl_rencana_kembali, status) VALUES (?, ?, ?, "Menunggu")',
            [id_user, tgl_pinjam, tgl_rencana_kembali]
        );
        return result.insertId;
    },
    async addDetail(id_peminjaman, id_alat, jumlah, total_harga) {
        await db.query(
            'INSERT INTO detail_peminjaman (id_peminjaman, id_alat, jumlah, total_harga) VALUES (?, ?, ?, ?)',
            [id_peminjaman, id_alat, jumlah, total_harga]
        );
    },
    async updateStatus(id_peminjaman, status, id_petugas) {
        await db.query(
            'UPDATE peminjaman SET status = ?, id_petugas = ? WHERE id_peminjaman = ?',
            [status, id_petugas, id_peminjaman]
        );
    },
    // Memanggil Stored Procedure MariaDB untuk pengembalian & denda otomatis
    async callKembalikanSP(id_peminjaman, tgl_kembali_sebenarnya) {
        await db.query('CALL sp_kembalikan_alat(?, ?)', [id_peminjaman, tgl_kembali_sebenarnya]);
    }
};

module.exports = PeminjamanModel;