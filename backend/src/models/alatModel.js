const db = require('../config/db');

const AlatModel = {
    async getAll() {
        const [rows] = await db.query(`
            SELECT a.*, k.nama_kategori 
            FROM alat a 
            JOIN kategori k ON a.id_kategori = k.id_kategori 
            WHERE a.deleted_at IS NULL
        `);
        return rows;
    },
    async create(data) {
        const { nama_alat, id_kategori, stok, deskripsi, harga_perhari } = data;
        const [result] = await db.query(
            'INSERT INTO alat (nama_alat, id_kategori, stok, deskripsi, harga_perhari) VALUES (?, ?, ?, ?, ?)',
            [nama_alat, id_kategori, stok, deskripsi, harga_perhari]
        );
        return result.insertId;
    },
    async update(id, data) {
        const { nama_alat, id_kategori, stok, deskripsi, harga_perhari } = data;
        await db.query(
            'UPDATE alat SET nama_alat = ?, id_kategori = ?, stok = ?, deskripsi = ?, harga_perhari = ? WHERE id_alat = ?',
            [nama_alat, id_kategori, stok, deskripsi, harga_perhari, id]
        );
    },
    async softDelete(id) {
        await db.query('UPDATE alat SET deleted_at = NOW() WHERE id_alat = ?', [id]);
    }
};

module.exports = AlatModel;