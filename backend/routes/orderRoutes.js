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
        const [rows] = await db.promise().query('SELECT * FROM orders WHERE status = "completed"');
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
        const [rows] = await db.promise().query('SELECT * FROM orders WHERE status = "pending"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/orders/:id
 * @description Get a specific order by ID, including customer name and ordered items
 */
router.get('/:id', async (req, res) => {
    try {
        // Query to get order details and join with customers table
        const [orderRows] = await db.promise().query(`
            SELECT 
                o.id AS id,
                c.customer_name AS customer_name,
                o.table_number AS table_number,
                o.total_amount AS total_amount,
                o.created_at AS date,
                o.status AS status
            FROM orders o
            JOIN customers c ON o.id = c.id
            WHERE o.id = ?
        `, [req.params.id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Query to get ordered items for the given order
        const [itemsRows] = await db.promise().query(`
            SELECT 
                oi.id AS id,
                m.name AS name,
                oi.quantity AS quantity,
                oi.price_at_time AS price
            FROM order_items oi
            JOIN menu_items m ON oi.menu_item_id = m.id
            WHERE oi.order_id = ?
        `, [req.params.id]);

        // Combine order details with items
        const orderDetails = {
            ...orderRows[0],
            items: itemsRows
        };

        res.json(orderDetails);
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
            const [menuItemResult] = await db.promise().query('SELECT is_available, quantity FROM menu_items WHERE id = ?', [item.id]);
            if (menuItemResult.length === 0 || menuItemResult[0].quantity < item.quantity) {
                return res.status(400).json({ message: `Menu item ${item.id} is not available in the requested quantity` });
            }
        }

        // Insert the order into the Orders table
        const [orderResult] = await db.promise().query(
            'INSERT INTO orders (table_number, total_amount, created_at, status) VALUES (?, ?, ?, ?)',
            [tableNo, orderTotal, orderDate, 'pending']
        );

        // Insert the ordered items into the Order_Items table
        for (const item of orderedItems) {
            await db.promise().query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderResult.insertId, item.id, item.quantity, item.price]
            );
        }

        // Update the inventory quantities in the Menu table
        for (const item of orderedItems) {
            await db.promise().query(
                'UPDATE menu_items SET quantity = quantity - ? WHERE id = ?',
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
 * @description Update the status of an order (e.g., from pending to completed)
 */
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const [result] = await db.promise().query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/orders/:id
 * @description Cancel an order by setting its status to "cancelled"
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('UPDATE orders SET status = "cancelled" WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
