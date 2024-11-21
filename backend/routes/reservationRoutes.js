const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const [reservations] = await db.query(
            `SELECT r.id, r.customer_id, r.table_id, r.date, r.time, r.party_size, r.status, r.created_at, 
                    c.first_name, c.last_name, rt.capacity, rt.location
             FROM reservations r
             JOIN customers c ON r.customer_id = c.id
             JOIN restaurant_tables rt ON r.table_id = rt.id`
        );

        if (reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        res.status(200).json({
            message: 'Reservations retrieved successfully',
            reservations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [reservation] = await db.query(
            `SELECT r.id, r.customer_id, r.table_id, r.date, r.time, r.party_size, r.status, r.created_at, 
                    c.first_name, c.last_name, rt.capacity, rt.location
             FROM reservations r
             JOIN customers c ON r.customer_id = c.id
             JOIN restaurant_tables rt ON r.table_id = rt.id
             WHERE r.id = ?`,
            [id]
        );

        if (reservation.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json({
            message: 'Reservation retrieved successfully',
            reservation: reservation[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { customerId, tableId, date, time, partySize, status } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO reservations (customer_id, table_id, date, time, party_size, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customerId, tableId, date, time, partySize, status || 'confirmed']
        );

        res.status(201).json({
            message: 'Reservation created successfully',
            reservationId: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const { customerId, tableId, date, time, partySize, status } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE reservations 
             SET customer_id = ?, table_id = ?, date = ?, time = ?, party_size = ?, status = ? 
             WHERE id = ?`,
            [customerId, tableId, date, time, partySize, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or no changes made' });
        }

        res.status(200).json({
            message: 'Reservation updated successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/reservations/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            `DELETE FROM reservations WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json({
            message: 'Reservation deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
