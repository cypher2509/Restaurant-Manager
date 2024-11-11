const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Simulated database (you'll replace this with actual DB calls)
let tables = [
    { id: 1, number: 1, isBooked: false },
    { id: 2, number: 2, isBooked: false },
    { id: 3, number: 3, isBooked: false },
    { id: 4, number: 4, isBooked: true },
    { id: 5, number: 5, isBooked: false },
    { id: 6, number: 6, isBooked: true },
];

let reservations = [
    { id: 1, customerName: 'John Doe', tableId: 4, status: 'pending' }, // Table 4 is booked
    { id: 2, customerName: 'Jane Smith', tableId: 6, status: 'completed' }, // Table 6 is booked
];

// GET: Return tables with pending reservations
router.get('/pending', (req, res) => {
    const pendingReservations = reservations.filter(res => res.status === 'pending');
    const pendingTables = pendingReservations.map(res => tables.find(table => table.id === res.tableId));
    res.json(pendingTables);
});

// GET: Return tables with completed reservations
router.get('/completed', (req, res) => {
    const completedReservations = reservations.filter(res => res.status === 'completed');
    const completedTables = completedReservations.map(res => tables.find(table => table.id === res.tableId));
    res.json(completedTables);
});

// GET: Return total count of pending and completed reservations
router.get('/count', (req, res) => {
    const pendingCount = reservations.filter(res => res.status === 'pending').length;
    const completedCount = reservations.filter(res => res.status === 'completed').length;
    res.json({ pending: pendingCount, completed: completedCount });
});

// POST: Create a reservation (and update the table availability)
router.post('/', (req, res) => {
    const { customerName, tableId } = req.body;
    
    // Check if the table is already booked
    const table = tables.find(t => t.id === tableId);
    if (!table || table.isBooked) {
        return res.status(400).json({ message: 'Table is already booked or not available' });
    }

    const newReservation = {
        id: reservations.length + 1,
        customerName,
        tableId,
        status: 'pending',
    };
    
    reservations.push(newReservation);
    table.isBooked = true;  // Mark the table as booked
    res.status(201).json(newReservation);
});

// PUT: Update reservation status (and change table availability accordingly)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = reservations.find(res => res.id === parseInt(id));
    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }

    // Update reservation status
    reservation.status = status;

    // Update table availability
    const table = tables.find(t => t.id === reservation.tableId);
    table.isBooked = (status === 'pending');  // If status is pending, the table remains booked
    
    res.json(reservation);
});

// DELETE: Delete reservation (and free the table)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const reservationIndex = reservations.findIndex(res => res.id === parseInt(id));
    
    if (reservationIndex === -1) {
        return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservation = reservations.splice(reservationIndex, 1)[0]; // Remove the reservation
    
    // Free the table associated with the reservation
    const table = tables.find(t => t.id === reservation.tableId);
    table.isBooked = false;
    
    res.json({ message: 'Reservation cancelled', reservation });
});

module.exports = router;
