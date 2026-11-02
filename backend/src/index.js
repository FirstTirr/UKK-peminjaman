const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan route auth
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/kategori', require('./routes/kategoriRoute'));
app.use('/api/alat', require('./routes/alatRoute'));
app.use('/api/peminjaman', require('./routes/peminjamanRoute'));
app.use('/api/log-aktivitas', require('./routes/logRoute'));
app.use('/api/laporan', require('./routes/laporanRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});