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

router.put('/', async (req, res, next) => {
    try {
        const query = 'UPDATE inventory_items SET quantity = ? WHERE id = ?';

        const { quantity, id } = req.body;
        const [rows] = await db.query(query, [quantity, id]);
        console.log(req.body)
        res.json({ message: 'Quantity updated successfully', affectedRows: rows.affectedRows });
    } catch (err) {
        next(err);
}});



module.exports = router;