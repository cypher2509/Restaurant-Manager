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
 * @description Get a specific order by ID, including customer name and ordered items
 */
router.get('/:id', async (req, res) => {
    try {
        // Query to get order details and join with customer table
        const [orderRows] = await db.promise().query(`
            SELECT 
                o.Order_ID AS id,
                c.Customer_Name AS customer_name,
                o.Employee_ID AS employee_id,
                o.Table_No AS table_number,
                o.Order_Total AS total_amount,
                o.Order_Date AS date,
                o.Status AS status
            FROM Orders o
            JOIN Customers c ON o.Customer_ID = c.Customer_ID
            WHERE o.Order_ID = ?
        `, [req.params.id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Query to get ordered items for the given order
        const [itemsRows] = await db.promise().query(`
            SELECT 
                oi.Item_ID AS id,
                m.Name AS name,
                oi.Quantity AS quantity,
                oi.Price AS price
            FROM Order_Items oi
            JOIN Menu m ON oi.Item_ID = m.Menu_ID
            WHERE oi.Order_ID = ?
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
            const [menuItemResult] = await db.promise().query('SELECT Quantity FROM Menu WHERE Menu_ID = ?', [item.id]);
            if (menuItemResult.length === 0 || menuItemResult[0].Quantity < item.quantity) {
                return res.status(400).json({ message: `Menu item ${item.id} is not available in the requested quantity` });
            }
        }

        // Insert the order into the Orders table
        const [orderResult] = await db.promise().query(
            'INSERT INTO Orders (Customer_Name, Table_No, Order_Total, Order_Date, Ordered_Items) VALUES (?, ?, ?, ?, ?)',
            [customerName, tableNo, orderTotal, orderDate, JSON.stringify(orderedItems)]
        );

        // Update the inventory quantities in the Menu table
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
 * @description Update the status of an order (e.g., from pending to completed)
 */
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const [result] = await db.promise().query('UPDATE Orders SET Status = ? WHERE Order_ID = ?', [status, req.params.id]);
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
