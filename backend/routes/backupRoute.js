const express = require('express');
const router = express.Router();
const { backupDatabase } = require('../utils/backup');

// POST /api/backup
router.post('/', async (req, res) => {
    try {
        const backupFile = await backupDatabase();
        res.status(200).json({ message: 'Backup created successfully', backupFile });
    } catch (error) {
        res.status(500).json({ message: 'Backup failed', error: error.message });
    }
});

module.exports = router;
