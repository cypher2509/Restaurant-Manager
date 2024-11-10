// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/employees
 * @description Get all employees
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Employee';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @route GET /api/employees/:id
 * @description Get a specific employee
 */
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM Employee WHERE Employee_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(results[0]);
    });
});

/**
 * @route POST /api/employees
 * @description Add a new employee
 */
router.post('/', (req, res) => {
    const { first_name, last_name, contact_number, role, hourly_wage } = req.body;
    const query = 'INSERT INTO Employee (First_Name, Last_Name, Contact_Number, Role, Hourly_Wage) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [first_name, last_name, contact_number, role, hourly_wage], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Employee added', id: results.insertId });
    });
});

/**
 * @route PUT /api/employees/:id
 * @description Update employee information
 */
router.put('/:id', (req, res) => {
    const { first_name, last_name, contact_number, role, hourly_wage } = req.body;
    const query = 'UPDATE Employee SET First_Name = ?, Last_Name = ?, Contact_Number = ?, Role = ?, Hourly_Wage = ? WHERE Employee_ID = ?';
    db.query(query, [first_name, last_name, contact_number, role, hourly_wage, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee updated' });
    });
});

/**
 * @route DELETE /api/employees/:id
 * @description Remove an employee
 */
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM Employee WHERE Employee_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    });
});

module.exports = router;