const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/reservations
 * @description Get all reservations
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM reservations');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/reservations/:id
 * @description Get a specific reservation by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/reservations
 * @description Create a new reservation
 */
router.post('/', async (req, res) => {
    const { customer_id, table_id, date, time, party_size, status } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO reservations (customer_id, table_id, date, time, party_size, status) VALUES (?, ?, ?, ?, ?, ?)',
            [customer_id, table_id, date, time, party_size, status || 'confirmed']
        );
        res.status(201).json({ message: 'Reservation created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/reservations/:id
 * @description Update a reservation by ID
 */
router.put('/:id', async (req, res) => {
    const { customer_id, table_id, date, time, party_size, status } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE reservations SET customer_id = ?, table_id = ?, date = ?, time = ?, party_size = ?, status = ? WHERE id = ?',
            [customer_id, table_id, date, time, party_size, status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json({ message: 'Reservation updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/reservations/:id
 * @description Delete a reservation by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('DELETE FROM reservations WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
