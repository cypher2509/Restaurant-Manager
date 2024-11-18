const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/menu
 * @description Get all menu items
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Menu');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/menu/:id
 * @description Get a specific menu item
 */
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Menu WHERE Menu_ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/menu
 * @description Add a new menu item
 */
router.post('/', async (req, res) => {
    const { name, description, price, category, quantity, img } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO Menu (Name, Description, Price, Category, Quantity, Image_URL) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category, quantity, img]
        );
        res.status(201).json({ message: 'Menu item added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/menu/:id
 * @description Update a menu item
 */
router.put('/:id', async (req, res) => {
    const { name, description, price, category, quantity, img } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE Menu SET Name = ?, Description = ?, Price = ?, Category = ?, Quantity = ?, Image_URL = ? WHERE Menu_ID = ?',
            [name, description, price, category, quantity, img, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/menu/:id
 * @description Delete a menu item
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('DELETE FROM Menu WHERE Menu_ID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
