const db = require('../config/db');

const PeminjamanModel = {
    async getAll(id_user = null) {
        const params = [];
        const userFilter = id_user === null ? '' : 'WHERE p.id_user = ?';

        if (id_user !== null) {
            params.push(id_user);
        }

        const [rows] = await db.query(`
            SELECT
                p.*,
                peminjam.username,
                petugas.username AS nama_petugas,
                d.id_detail,
                d.id_alat AS item_id_alat,
                d.jumlah AS item_jumlah,
                d.total_harga AS item_total_harga,
                a.nama_alat AS item_nama_alat
            FROM peminjaman p
            JOIN user peminjam ON p.id_user = peminjam.id_user
            LEFT JOIN user petugas ON p.id_petugas = petugas.id_user
            LEFT JOIN detail_peminjaman d ON p.id_peminjaman = d.id_peminjaman
            LEFT JOIN alat a ON d.id_alat = a.id_alat
            ${userFilter}
            ORDER BY p.created_at DESC, p.id_peminjaman DESC, d.id_detail ASC
        `, params);

        const peminjamanMap = new Map();

        for (const row of rows) {
            const {
                id_detail,
                item_id_alat,
                item_jumlah,
                item_total_harga,
                item_nama_alat,
                ...peminjaman
            } = row;

            if (!peminjamanMap.has(row.id_peminjaman)) {
                peminjamanMap.set(row.id_peminjaman, {
                    ...peminjaman,
                    items: []
                });
            }

            if (id_detail !== null) {
                peminjamanMap.get(row.id_peminjaman).items.push({
                    id_detail,
                    id_alat: item_id_alat,
                    nama_alat: item_nama_alat,
                    jumlah: item_jumlah,
                    total_harga: item_total_harga
                });
            }
        }

        return Array.from(peminjamanMap.values());
    },
    async createHeader(id_user, tgl_pinjam, tgl_rencana_kembali, executor = db) {
        const [result] = await executor.query(
            'INSERT INTO peminjaman (id_user, tgl_pinjam, tgl_rencana_kembali, status) VALUES (?, ?, ?, "Menunggu")',
            [id_user, tgl_pinjam, tgl_rencana_kembali]
        );
        return result.insertId;
    },
    async addDetail(id_peminjaman, id_alat, jumlah, total_harga, executor = db) {
        await executor.query(
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
    async callKembalikanSP(id_peminjaman, tgl_kembali_sebenarnya) {
        await db.query('CALL sp_kembalikan_alat(?, ?)', [id_peminjaman, tgl_kembali_sebenarnya]);
    }
};

module.exports = PeminjamanModel;
