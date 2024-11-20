// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');



router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventory_items'); 
        res.json(rows); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

module.exports = router;