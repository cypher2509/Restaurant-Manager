// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/reports/sales
 * @description Get sales report
 */
router.get('/sales/annual', async (req, res) => {
    const {year} = req.query;
    const query = 'call getAnnualRevenue(?)';
    
    const annualSale = await db.query(query, [year]);

    res.json(annualSale[0]);
});

router.get('/sales/monthly', async (req, res) => {
    const {year} = req.query;
    const query = 'call getMonthlyRevenue(?)';
    
    const monthlySale = await db.query(query, [year]);

    res.json(monthlySale);
});

/**
 * @route GET /api/reports/inventory
 * @description Get inventory report
 */
router.get('/customer', async(req, res) => {
    const {year, month} = req.query;
    const query = 'SELECT GetTopSpendingCustomer(?, ?) AS TopSpendingCustomer';
    
    const topCustomer = await db.query(query, [year,month]);
    
    const query2 = 'call getTopSpendingCustomers(?)'

    const top10Customers = await db.query(query2, [year])

    const query3 = 'call getRepeatCustomers(?)';

    const repeatedCustomers = await db.query(query3, [year]);

    const query4 = ' SELECT COUNT(DISTINCT o.customer_id) AS CustomersWhoOrdered FROM orders o WHERE YEAR(o.created_at) = ?;'

    const totalCustomers = await db.query(query4 , [year])

    res.json({topCustomer, top10Customers, repeatedCustomers, totalCustomers});
});

router.get('/busyDays', async(req,res)=> {
    const {year} = req.query;
    const query = 'call getTopPerformingDays(?)';
    const topPerformingDays =  await db.query(query, [year]);

    const query2 = 'call getTotalOrdersByDay(?)';

    const weeklyPerformance = await db.query(query2, [year]);

    res.json({topPerformingDays, weeklyPerformance});
})

module.exports = router;