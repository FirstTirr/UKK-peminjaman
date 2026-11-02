// seed.js
const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Cek apakah admin sudah ada
        const [existing] = await db.query('SELECT * FROM user WHERE username = ?', ['admin']);
        if (existing.length > 0) {
            console.log('Akun Admin sudah ada di database.');
            process.exit(0);
        }

        // Insert Admin default
        await db.query(
            'INSERT INTO user (username, password_hash, role, no_hp, alamat) VALUES (?, ?, ?, ?, ?)',
            ['admin', hashedPassword, 'admin', '081234567890', 'Kantor Pusat']
        );

        console.log('Berhasil membuat akun Admin default (Username: admin, Password: admin123)');
        process.exit(0);
    } catch (error) {
        console.error('Gagal melakukan seeding admin:', error.message);
        process.exit(1);
    }
}

seedAdmin();