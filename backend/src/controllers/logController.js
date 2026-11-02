const LogModel = require('../models/logModel');

const logController = {
    async read(req, res) {
        try {
            const data = await LogModel.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = logController;