// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/menu
 * @description Get all menu items
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Menu';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @route GET /api/menu/:id
 * @description Get a specific menu item
 */
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM Menu WHERE Menu_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(results[0]);
    });
});

/**
 * @route POST /api/menu
 * @description Add a new menu item
 */
router.post('/', (req, res) => {
    const { name, description, price, category } = req.body;
    const query = 'INSERT INTO Menu (Name, Description, Price, Category) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Menu item added', id: results.insertId });
    });
});

/**
 * @route PUT /api/menu/:id
 * @description Update a menu item
 */
router.put('/:id', (req, res) => {
    const { name, description, price, category } = req.body;
    const query = 'UPDATE Menu SET Name = ?, Description = ?, Price = ?, Category = ? WHERE Menu_ID = ?';
    db.query(query, [name, description, price, category, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item updated' });
    });
});

/**
 * @route DELETE /api/menu/:id
 * @description Delete a menu item
 */
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM Menu WHERE Menu_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted' });
    });
});

module.exports = router;