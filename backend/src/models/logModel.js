const db = require('../config/db');

const LogModel = {
    async getAll() {
        const [rows] = await db.query(`
            SELECT l.*, u.username 
            FROM log_aktivitas l
            JOIN user u ON l.id_user = u.id_user
            ORDER BY l.created_at DESC
            LIMIT 100
        `);
        return rows;
    }
};

module.exports = LogModel;