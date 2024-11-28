// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');



router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventory_items'); 
        res.json(rows); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.put('/', async (req, res, next) => {
    try {
        const query = 'UPDATE inventory_items SET quantity = ? WHERE id = ?';

        const { quantity, id } = req.body;
        const [rows] = await db.query(query, [quantity, id]);
        console.log(req.body)
        res.json({ message: 'Quantity updated successfully', affectedRows: rows.affectedRows });
    } catch (err) {
        next(err);
}});

router.get('/usage/:id', async(req,res,next)=> {
    try{
        const id = [req.params.id]
        const query = 'SELECT * FROM inventory_usage WHERE menu_item_id = ?';
        const [rows] = await db.query(query, id);
        res.json(rows);
    }
    catch (err) {
        next(err);
}});

router.get('/ordered/:page', async(req,res,next)=>{
    try{
        const page = [req.params.page]
        const offset = (page-1) * 25; //limits only 50 rows per page.
        const query = 'SELECT * FROM inventory_order_details ORDER BY order_date DESC LIMIT 25 OFFSET ?;';
        const [rows] = await db.query(query,[offset]);
        res.json(rows);
    }
    catch (err) {
        next(err);
}
})

router.post('/order', async (req, res, next) => {
    try {
        // Extract required fields from the request body
        const { inventory_item_id, cost_per_unit, quantity } = req.body;

        // Validate input
        if (!inventory_item_id || !cost_per_unit || !quantity) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // SQL query to insert into inventory_orders
        const query = `
            INSERT INTO inventory_orders (inventory_item_id, cost_per_unit, quantity)
            VALUES (?, ?, ?)
        `;

        // Execute the query with values
        await db.execute(query, [inventory_item_id, cost_per_unit, quantity]);

        res.status(201).json({ message: 'Inventory order created successfully!' });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order.' });
    }
});


module.exports = router;