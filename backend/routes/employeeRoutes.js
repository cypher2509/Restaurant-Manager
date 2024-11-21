// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM employees');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});


router.post('/', async (req, res, next) => {
    const { first_name, last_name, role, hourly_wage, email } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO employees (first_name, last_name, role, hourly_wage, email) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, role, hourly_wage, email]
        );
        res.status(201).json({ id: result.insertId, first_name, last_name, role, hourly_wage, email });
    } catch (err) {
        next(err);
    }
});



router.put('/:id', async (req, res, next) => {
    const { id } = req.params; // Extract employee ID from the URL parameter
    const { first_name, last_name, role, hourly_wage, email } = req.body;

    // Check if all required fields are provided
    if (!first_name || !last_name || !role || !hourly_wage || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        console.log(`Updating employee with ID: ${id}`);
        
        // Update the employee details in the database
        const [result] = await db.query(
            'UPDATE employees SET first_name = ?, last_name = ?, role = ?, hourly_wage = ?, email = ? WHERE id = ?',
            [first_name, last_name, role, hourly_wage, email, id]
        );

        console.log(`Query result: ${JSON.stringify(result)}`);

        if (result.affectedRows === 0) {
            // If no rows were updated, return a 404 error (employee not found)
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Send back the updated employee data
        res.status(200).json({
            id,
            first_name,
            last_name,
            role,
            hourly_wage,
            email
        });
    } catch (err) {
        console.error(err); // Log any error to the console for debugging
        next(err); // Pass errors to the error-handling middleware
    }
});



router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM employees WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(204).send(); // Successfully deleted, no content to return
    } catch (err) {
        next(err);
    }
});

module.exports = router;
