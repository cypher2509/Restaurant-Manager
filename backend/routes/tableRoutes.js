const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/',async(req,res)=>{
    const query = 'SELECT * from restaurant_tables' 
    let [rows] = await db.query(query);
    res.json(rows);
});

router.get('/available',async(req,res)=>{
    try{
        const {date,time , partySize} = req.body;
        let query = 'CALL getAvailableTables(?,?,?)';
        const [rows] = await db.query(query,[date, time , partySize]);
        res.json(rows[0]);
    }
    catch (err) {
        next(err);
}
});

module.exports = router;