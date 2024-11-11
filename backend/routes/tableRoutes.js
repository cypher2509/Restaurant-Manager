const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Simulated database (replace this with actual DB calls)
let tables = [
    { id: 1, number: 1, isBooked: false },
    { id: 2, number: 2, isBooked: false },
    { id: 3, number: 3, isBooked: false },
    { id: 4, number: 4, isBooked: true },
    { id: 5, number: 5, isBooked: false },
    { id: 6, number: 6, isBooked: true },
];

// GET: Get all tables
router.get('/', (req, res) => {
    res.json(tables);  // Return all tables with booking status
});

// POST: Create a new table (not a common operation in a restaurant management system)
router.post('/', (req, res) => {
    const { number, isBooked } = req.body;
    const newTable = { id: tables.length + 1, number, isBooked };
    tables.push(newTable);
    res.status(201).json(newTable);
});

// PUT: Update table (change availability)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { isBooked } = req.body;
    const table = tables.find(t => t.id === parseInt(id));
    
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }

    table.isBooked = isBooked;  // Update table availability
    res.json(table);
});

// DELETE: Delete table (mark as available)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const tableIndex = tables.findIndex(t => t.id === parseInt(id));

    if (tableIndex === -1) {
        return res.status(404).json({ message: 'Table not found' });
    }

    const table = tables.splice(tableIndex, 1)[0];  // Remove table from array
    res.json({ message: 'Table deleted', table });
});

module.exports = router;
