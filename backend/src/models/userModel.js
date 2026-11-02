const db = require('../config/db');

const UserModel = {
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
        return rows[0];
    },
    async getAll() {
        const [rows] = await db.query('SELECT id_user, username, role, no_hp, alamat, created_at FROM user');
        return rows;
    },
    async getById(id) {
        const [rows] = await db.query('SELECT id_user, username, role, no_hp, alamat, created_at FROM user WHERE id_user = ?', [id]);
        return rows[0];
    },
    async create(data) {
        const { username, password_hash, role, no_hp, alamat } = data;
        const [result] = await db.query(
            'INSERT INTO user (username, password_hash, role, no_hp, alamat) VALUES (?, ?, ?, ?, ?)',
            [username, password_hash, role, no_hp || null, alamat || null]
        );
        return result.insertId;
    },
    async update(id, data) {
        const { username, role, no_hp, alamat } = data;
        await db.query(
            'UPDATE user SET username = ?, role = ?, no_hp = ?, alamat = ? WHERE id_user = ?',
            [username, role, no_hp, alamat, id]
        );
    },
    async delete(id) {
        await db.query('DELETE FROM user WHERE id_user = ?', [id]);
    }
};

module.exports = UserModel;