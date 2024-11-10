// backend/controllers/menuController.js
const db = require('../config/db');

exports.getAllMenuItems = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu_items');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const [result] = await db.query(
            'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
            [name, description, price, category]
        );
        
        const [newItem] = await db.query(
            'SELECT * FROM menu_items WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newItem[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const [result] = await db.query(
            'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
            [name, description, price, category, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        const [updatedItem] = await db.query(
            'SELECT * FROM menu_items WHERE id = ?',
            [req.params.id]
        );
        
        res.json(updatedItem[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM menu_items WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};