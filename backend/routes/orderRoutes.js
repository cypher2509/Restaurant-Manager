// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/orders/completed
 * @description Get all completed orders
 */
router.get('/completed', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Orders WHERE Status = "completed"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/orders/pending
 * @description Get all pending orders
 */
router.get('/pending', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Orders WHERE Status = "pending"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/orders/:id
 * @description Get a specific order
 */
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Orders WHERE Order_ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/orders
 * @description Create a new order
 */
router.post('/', async (req, res) => {
    const { customerName, tableNo, orderTotal, orderDate, orderedItems } = req.body;

    try {
        // Validate ordered items
        for (const item of orderedItems) {
            const [menuItemResult] = await db.promise().query('SELECT Quantity FROM Menu WHERE Menu_ID = ?', [item.id]);
            if (menuItemResult.length === 0 || menuItemResult[0].Quantity < item.quantity) {
                return res.status(400).json({ message: `Menu item ${item.id} is not available in the requested quantity` });
            }
        }

        // Insert the order
        const [orderResult] = await db.promise().query(
            'INSERT INTO Orders (Customer_Name, Table_No, Order_Total, Order_Date, Ordered_Items) VALUES (?, ?, ?, ?, ?)',
            [customerName, tableNo, orderTotal, orderDate, JSON.stringify(orderedItems)]
        );

        // Update the inventory quantities
        for (const item of orderedItems) {
            await db.promise().query(
                'UPDATE Menu SET Quantity = Quantity - ? WHERE Menu_ID = ?',
                [item.quantity, item.id]
            );
        }

        // Respond with order details
        res.status(201).json({
            message: 'Order created',
            orderId: orderResult.insertId,
            orderDetails: {
                customerName,
                tableNo,
                orderTotal,
                orderDate,
                orderedItems
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/orders/:id
 * @description Update an order status
 */
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const [result] = await db.promise().query('UPDATE Orders SET Status = ? WHERE Order_ID = ?', [status, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/orders/:id
 * @description Cancel an order
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('UPDATE Orders SET Status = "cancelled" WHERE Order_ID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;