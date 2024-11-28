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
        const [rows] = await db.query('SELECT * FROM orders WHERE status = "priority" AND DATE(created_at) = CURDATE()') ;
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
    const { customer_id, table_number, total_amount, items } = req.body;
    try {
        // Insert the order into the orders table
        const [orderResult] = await db.query(
            'INSERT INTO orders ( customer_id, table_number, total_amount, status) VALUES ( ?, ?, ?, ?)',
            [customer_id, table_number, total_amount, 'pending']
        );

        console.log(orderResult)

        // Insert ordered items into the order_items table
        for (const item of items) {
            const [itmes] = await db.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
                [orderResult.insertId, item.id, item.quantity]
            );
        }

        // Respond with order details
        res.status(201).send({
            message: 'Order created',
            orderId: orderResult.insertId,
            orderDetails: {
                customer_id,
                table_number,
                total_amount,
                items
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
    const { orderId } = req.params;
    const { customer_id, table_number, total_amount, items, status } = req.body; // Include `status` in the request body
    console.log(req.body);
    try {
        // Update the `orders` table, including the status
        const [updateOrderResult] = await db.query(
            'UPDATE orders SET customer_id = ?, table_number = ?, total_amount = ?, status = ? WHERE id = ?',
            [customer_id, table_number, total_amount, status, orderId]
        );

        console.log('Updated order in orders table:', updateOrderResult);

        // Delete existing items from the `order_items` table for this order
        const [deleteItemsResult] = await db.query(
            'DELETE FROM order_items WHERE order_id = ?',
            [orderId]
        );

        console.log('Deleted items from order_items table:', deleteItemsResult);

        // Insert updated items into the `order_items` table
        for (const item of items) {
            console.log('Inserting item into order_items:', item);

            const [insertItemResult] = await db.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.id, item.quantity]
            );

            console.log('Inserted item into order_items table:', insertItemResult);
        }

        // Respond with the updated order details
        res.status(200).send({
            message: 'Order updated',
            orderId,
            orderDetails: {
                customer_id,
                table_number,
                total_amount,
                items,
                status
            }
        });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: err.message });
    }
});



/**
 * @route DELETE /api/orders/:id
 * @description Cancel an order by setting its status to "cancelled"
 */
router.delete('/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        console.log(result)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
