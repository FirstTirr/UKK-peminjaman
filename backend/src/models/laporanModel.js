const db = require('../config/db');

const LaporanModel = {
    async getLaporan() {
        const [rows] = await db.query(`
            SELECT 
                p.id_peminjaman, u.username AS peminjam, 
                p.tgl_pinjam, p.tgl_rencana_kembali, p.status,
                COALESCE(pg.tgl_kembali_sebenarnya, '-') AS tgl_kembali,
                COALESCE(pg.denda, 0) AS denda,
                COALESCE(pg.total_pembayaran, 0) AS total_pembayaran
            FROM peminjaman p
            JOIN user u ON p.id_user = u.id_user
            LEFT JOIN pengembalian pg ON p.id_peminjaman = pg.id_peminjaman
            ORDER BY p.created_at DESC
        `);
        return rows;
    }
};

module.exports = LaporanModel;