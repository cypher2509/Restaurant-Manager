// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/orders
 * @description Get all orders
 */
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders'); // Use await instead of a callback
        res.json(rows); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

/**
 * @route GET /api/orders/:id
 * @description Get a specific order
 */
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM Orders WHERE Order_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(results[0]);
    });
});

/**
 * @route POST /api/orders
 * @description Create a new order
 */
router.post('/', (req, res) => {
    console.log(req.body);
    const { customer_id, items, total_amount, status } = req.body;
    const query = 'INSERT INTO Orders (Customer_ID, Order_Items, Total_Amount, Status) VALUES (?, ?, ?, ?)';
    db.query(query, [customer_id, JSON.stringify(items), total_amount, status || 'pending'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Order created', id: results.insertId });
    });
});

/**
 * @route PUT /api/orders/:id
 * @description Update an order status
 */
router.put('/:id', (req, res) => {
    const { status } = req.body;
    const query = 'UPDATE Orders SET Status = ? WHERE Order_ID = ?';
    db.query(query, [status, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated' });
    });
});

/**
 * @route DELETE /api/orders/:id
 * @description Cancel an order
 */
router.delete('/:id', (req, res) => {
    const query = 'UPDATE Orders SET Status = "cancelled" WHERE Order_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled' });
    });
});

module.exports = router;