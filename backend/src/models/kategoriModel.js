const db = require('../config/db');

const KategoriModel = {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM kategori');
        return rows;
    },
    async create(nama_kategori) {
        const [result] = await db.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori]);
        return result.insertId;
    },
    async update(id, nama_kategori) {
        await db.query('UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?', [nama_kategori, id]);
    },
    async delete(id) {
        await db.query('DELETE FROM kategori WHERE id_kategori = ?', [id]);
    }
};

module.exports = KategoriModel;