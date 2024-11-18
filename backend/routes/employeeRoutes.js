const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/employees
 * @description Get all employees
 */
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Employee';
        const results = await db.query(query);
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/employees/:id
 * @description Get a specific employee
 */
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM Employee WHERE Employee_ID = ?';
        const [results] = await db.query(query, [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(results[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/employees
 * @description Add a new employee
 */
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, contact_number, role, hourly_wage } = req.body;
        const query = 'INSERT INTO Employee (First_Name, Last_Name, Contact_Number, Role, Hourly_Wage) VALUES (?, ?, ?, ?, ?)';
        const [results] = await db.query(query, [first_name, last_name, contact_number, role, hourly_wage]);
        res.status(201).json({ message: 'Employee added', id: results.insertId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/employees/:id
 * @description Update employee information
 */
router.put('/:id', async (req, res) => {
    try {
        const { first_name, last_name, contact_number, role, hourly_wage } = req.body;
        const query = 'UPDATE Employee SET First_Name = ?, Last_Name = ?, Contact_Number = ?, Role = ?, Hourly_Wage = ? WHERE Employee_ID = ?';
        const [results] = await db.query(query, [first_name, last_name, contact_number, role, hourly_wage, req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee updated' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/employees/:id
 * @description Remove an employee
 */
router.delete('/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM Employee WHERE Employee_ID = ?';
        const [results] = await db.query(query, [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;