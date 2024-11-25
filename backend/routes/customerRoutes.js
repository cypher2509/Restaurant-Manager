const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        // Fetch all customers from the database
        const [customers] = await db.query(
            'SELECT * FROM customers'
        );
        
        // Check if the result set is empty
        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }

        // Respond with the list of customers
        res.status(200).json({
            message: 'Customers retrieved successfully',
            customers: customers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/check', async (req, res) => {
    const { contactNumber } = req.query;
    console.log(contactNumber)

    try {
        const [customerResult] = await db.query(
            'SELECT * FROM customers WHERE contact_number = ?',
            [contactNumber]
        );

        if (customerResult.length === 0) {
            return res.status(200).json({ message: 'Customer not found' });
        }

        res.status(200).json({ 
            message: 'Customer found', 
            customer: customerResult[0] 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log( err.message )
    }
});

router.post('/', async (req, res) => {
    const { firstName, lastName, contactNumber, email } = req.body;

    try {
        const [newCustomer] = await db.query(
            'INSERT INTO customers (first_name, last_name, contact_number, email) VALUES (?, ?, ?, ?)',
            [firstName, lastName, contactNumber, email]
        );

        res.status(201).json({ 
            message: 'Customer created successfully', 
            customerId: newCustomer.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err.message)
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, contactNumber, email } = req.body;

    try {
        // Check if the customer exists
        const [customerExists] = await db.query(
            'SELECT * FROM customers WHERE id = ?',
            [id]
        );

        if (customerExists.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the customer's details
        const [result] = await db.query(
            'UPDATE customers SET first_name = ?, last_name = ?, contact_number = ?, email = ? WHERE id = ?',
            [firstName, lastName, contactNumber, email, id]
        );

        // Check if the update made changes
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No changes were made to the customer' });
        }

        res.status(200).json({ 
            message: 'Customer updated successfully' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the customer exists
        const [customerExists] = await db.query(
            'SELECT * FROM customers WHERE id = ?',
            [id]
        );

        if (customerExists.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Delete the customer
        const [result] = await db.query(
            'DELETE FROM customers WHERE id = ?',
            [id]
        );

        res.status(200).json({ 
            message: 'Customer deleted successfully' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;