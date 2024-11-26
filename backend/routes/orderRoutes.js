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
        const [rows] = await db.query('SELECT * FROM orders WHERE status = "completed" AND DATE(created_at) = CURDATE()');
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
        const [rows] = await db.query('SELECT * FROM orders WHERE status = "pending" AND DATE(created_at) = CURDATE()');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/priority', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE status = "priority" AND DATE(created_at) = CURDATE()');
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
        const [orderRows] = await db.query(`SELECT * FROM view_customer_order_details WHERE order_id = ?`, [req.params.id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orderRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/orders
 * @description Create a new order
 */
router.post('/', async (req, res) => {
    const { customerId, table_number, total_amount, date, items } = req.body;
    console.log(req.body);
    try {

        // Insert the order into the orders table
        const [orderResult] = await db.query(
            'INSERT INTO orders (customer_id, table_number, total_amount, created_at, status) VALUES (?, ?, ?, ?, ?)',
            [customerId, tableNo, orderTotal, orderDate, 'pending']
        );

        // Insert ordered items into the order_items table
        for (const item of orderedItems) {
            await db.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
                [orderResult.insertId, item.id, item.quantity]
            );
        }

        // Respond with order details
        res.status(201).json({
            message: 'Order created',
            orderId: orderResult.insertId,
            orderDetails: {
                customerId,
                contactNumber,
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
router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params; // Get the order ID from the URL
    const { contactNumber, tableNo, orderTotal, orderDate, orderedItems, status } = req.body;

    try {
        // Fetch the customer ID based on the contact number
        const [customerResult] = await db.query(
            'SELECT id FROM customers WHERE contact_number = ?',
            [contactNumber]
        );

        if (customerResult.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customerId = customerResult[0].id;

        // Check if the order exists
        const [orderExists] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );

        if (orderExists.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order details in the orders table
        await db.query(
            'UPDATE orders SET customer_id = ?, table_number = ?, total_amount = ?, created_at = ?, status = ? WHERE id = ?',
            [customerId, tableNo, orderTotal, orderDate, status || 'pending', orderId]
        );

        // Delete existing order items for this order
        await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);

        // Insert the updated ordered items into the order_items table
        for (const item of orderedItems) {
            await db.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.id, item.quantity]
            );
        }

        // Respond with updated order details
        res.status(200).json({
            message: 'Order updated successfully',
            orderId,
            updatedOrderDetails: {
                customerId,
                contactNumber,
                tableNo,
                orderTotal,
                orderDate,
                status,
                orderedItems
            }
        });
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
        const [result] = await db.query('UPDATE orders SET status = "cancelled" WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
