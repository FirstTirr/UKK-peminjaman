const db = require('../config/db');
const PeminjamanModel = require('../models/peminjamanModel');

const PeminjamanService = {
    async ajukanPeminjaman(id_user, data) {
        const { tgl_pinjam, tgl_rencana_kembali, items } = data; // items = [{id_alat, jumlah}]

        if (!tgl_pinjam || !tgl_rencana_kembali || !Array.isArray(items) || items.length === 0) {
            throw new Error('Tanggal dan minimal satu detail alat wajib diisi');
        }

        const normalizedItems = items.map((item) => ({
            id_alat: Number(item.id_alat),
            jumlah: Number(item.jumlah)
        }));

        for (const item of normalizedItems) {
            if (!Number.isInteger(item.id_alat) || !Number.isInteger(item.jumlah) || item.jumlah < 1) {
                throw new Error('Detail alat tidak valid');
            }
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const id_peminjaman = await PeminjamanModel.createHeader(
                id_user,
                tgl_pinjam,
                tgl_rencana_kembali,
                connection
            );

            for (const item of normalizedItems) {
                const [alatRows] = await connection.query(
                    'SELECT harga_perhari, stok FROM alat WHERE id_alat = ? AND deleted_at IS NULL FOR UPDATE',
                    [item.id_alat]
                );
                if (alatRows.length === 0) throw new Error(`Alat dengan ID ${item.id_alat} tidak ditemukan`);

                const alat = alatRows[0];
                if (alat.stok < item.jumlah) throw new Error(`Stok alat ID ${item.id_alat} tidak mencukupi`);

                const diffTime = Math.abs(new Date(tgl_rencana_kembali) - new Date(tgl_pinjam));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                const total_harga = alat.harga_perhari * item.jumlah * diffDays;

                await PeminjamanModel.addDetail(
                    id_peminjaman,
                    item.id_alat,
                    item.jumlah,
                    total_harga,
                    connection
                );
            }

            await connection.commit();
            return id_peminjaman;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = PeminjamanService;
