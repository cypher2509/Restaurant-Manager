const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/restaurant_tables
 * @description Get all restaurant tables
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM restaurant_tables');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/restaurant_tables/:id
 * @description Get a specific restaurant table by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM restaurant_tables WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Restaurant table not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/restaurant_tables
 * @description Add a new restaurant table
 */
router.post('/', async (req, res) => {
    const { capacity } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO restaurant_tables (capacity) VALUES (?)',
            [capacity]
        );
        res.status(201).json({ message: 'Restaurant table added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/restaurant_tables/:id
 * @description Update a restaurant table by ID
 */
router.put('/:id', async (req, res) => {
    const { capacity } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE restaurant_tables SET capacity = ? WHERE id = ?',
            [capacity, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant table not found' });
        }
        res.json({ message: 'Restaurant table updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/restaurant_tables/:id
 * @description Delete a restaurant table by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('DELETE FROM restaurant_tables WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant table not found' });
        }
        res.json({ message: 'Restaurant table deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
