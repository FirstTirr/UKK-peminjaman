const LaporanModel = require('../models/laporanModel');

const laporanController = {
    async read(req, res) {
        try {
            const data = await LaporanModel.getLaporan();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = laporanController;