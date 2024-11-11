const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Simulate database (you should replace this with actual DB calls)
let customers = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
];

// GET: Get all customers
router.get('/', (req, res) => {
    res.json(customers);  // Return all customers
});

// POST: Create a new customer
router.post('/', (req, res) => {
    const { name, email } = req.body;
    const newCustomer = { id: customers.length + 1, name, email };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);  // Return the newly created customer
});

// PUT: Update an existing customer
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const customer = customers.find(c => c.id === parseInt(id));
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    res.json(customer);
});

// DELETE: Delete a customer
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const customerIndex = customers.findIndex(c => c.id === parseInt(id));

    if (customerIndex === -1) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    const deletedCustomer = customers.splice(customerIndex, 1)[0];
    res.json({ message: 'Customer deleted', deletedCustomer });
});

module.exports = router
