// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/menu
 * @description Get all menu items
 */

router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu_items'); 
        res.json(rows); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});


/**
 * @route GET /api/menu/:id
 * @description Get a specific menu item
//  */
// router.get('/:id', (req, res) => {
//     const query = 'SELECT * FROM menu_items WHERE id = ?';
//     db.query(query, [req.params.id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ message: 'Menu item not found' });
//         }
//         res.json(results[0]);
//     });
// });


router.get('/:id', async (req, res, next) => {
    try {
        const id = [req.params.id]
        const query1 = 'SELECT * FROM menu_items WHERE id = ?';
        const [menu_details] = await db.query(query1, id); 
        const query2 = 'SELECT * FROM inventory_usage WHERE menu_item_id= ?'
        const [item_contents] = await db.query(query2, id);
        console.log(menu_details); // Log the result
        res.json({details: menu_details,contents:item_contents} ); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
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