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
    },
    async getPengembalian() {
        const [rows] = await db.query(`
            SELECT
                pg.id_pengembalian,
                pg.id_peminjaman,
                u.username AS peminjam,
                p.tgl_rencana_kembali,
                pg.tgl_kembali_sebenarnya,
                pg.denda,
                pg.total_pembayaran,
                p.status
            FROM pengembalian pg
            JOIN peminjaman p ON pg.id_peminjaman = p.id_peminjaman
            JOIN user u ON p.id_user = u.id_user
            ORDER BY pg.created_at DESC, pg.id_pengembalian DESC
        `);
        return rows;
    }
};

module.exports = LaporanModel;
