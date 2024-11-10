// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/reports/sales
 * @description Get sales report
 */
router.get('/sales', (req, res) => {
    const query = `
        SELECT 
            DATE(Order_Date) as date,
            COUNT(*) as total_orders,
            SUM(Total_Amount) as total_sales
        FROM Orders 
        WHERE Status = 'completed'
        GROUP BY DATE(Order_Date)
        ORDER BY date DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @route GET /api/reports/inventory
 * @description Get inventory report
 */
router.get('/inventory', (req, res) => {
    const query = `
        SELECT 
            m.Menu_ID,
            m.Name,
            m.Category,
            COUNT(o.Order_ID) as times_ordered
        FROM Menu m
        LEFT JOIN Order_Items oi ON m.Menu_ID = oi.Menu_ID
        LEFT JOIN Orders o ON oi.Order_ID = o.Order_ID
        GROUP BY m.Menu_ID
        ORDER BY times_ordered DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @route GET /api/reports/performance
 * @description Get employee performance report
 */
router.get('/performance', (req, res) => {
    const query = `
        SELECT 
            e.Employee_ID,
            e.First_Name,
            e.Last_Name,
            e.Role,
            COUNT(o.Order_ID) as orders_handled,
            AVG(o.Total_Amount) as avg_order_amount
        FROM Employee e
        LEFT JOIN Orders o ON e.Employee_ID = o.Employee_ID
        GROUP BY e.Employee_ID
        ORDER BY orders_handled DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;