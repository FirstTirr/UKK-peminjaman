const db = require('../config/db');
const PeminjamanModel = require('../models/peminjamanModel');

const PeminjamanService = {
    async ajukanPeminjaman(id_user, data) {
        const { tgl_pinjam, tgl_rencana_kembali, items } = data; // items = [{id_alat, jumlah}]
        
        const id_peminjaman = await PeminjamanModel.createHeader(id_user, tgl_pinjam, tgl_rencana_kembali);

        for (let item of items) {
            const [alatRows] = await db.query('SELECT harga_perhari, stok FROM alat WHERE id_alat = ?', [item.id_alat]);
            if (alatRows.length === 0) throw new Error(`Alat dengan ID ${item.id_alat} tidak ditemukan`);
            
            const alat = alatRows[0];
            if (alat.stok < item.jumlah) throw new Error(`Stok alat ID ${item.id_alat} tidak mencukupi`);

            const diffTime = Math.abs(new Date(tgl_rencana_kembali) - new Date(tgl_pinjam));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            
            const total_harga = alat.harga_perhari * item.jumlah * diffDays;

            await PeminjamanModel.addDetail(id_peminjaman, item.id_alat, item.jumlah, total_harga);
        }

        return id_peminjaman;
    }
};

module.exports = PeminjamanService;