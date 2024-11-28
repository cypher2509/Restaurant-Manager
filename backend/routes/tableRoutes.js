const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/',async(req,res)=>{
    const query = 'SELECT * from restaurant_tables' 
    let [rows] = await db.query(query);
    res.json(rows);
});

router.get('/available', async (req, res, next) => {
    try {
        // Extract query parameters from req.query
        const { date, time, partySize } = req.query;
        console.log(req.query);

        // Call the stored procedure with the extracted parameters
        let query = 'CALL getAvailableTables(?,?,?)';
        const [rows] = await db.query(query, [date, time, partySize]);

        // Respond with the available tables
        res.json(rows[0]);
    } catch (err) {
        // Pass error to the error handling middleware
        next(err);
    }
});


module.exports = router;