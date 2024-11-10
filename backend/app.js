const express = require('express');
const app = express();
const port = 3000;

// Import database configuration
const db = require('./config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route test
app.get('/', (req, res) => {
    res.json({ message: 'Restaurant Management System API' });
});

// Import routes - following RESTful naming conventions
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reportRoutes = require('./routes/reportRoutes');

/**
 * Menu Routes
 * GET /api/menu - Get all menu items
 * POST /api/menu - Add new menu item
 * PUT /api/menu/:id - Update menu item
 * DELETE /api/menu/:id - Remove menu item
 */
app.use('/api/menu', menuRoutes);

/**
 * Order Routes
 * GET /api/orders - Get all orders
 * POST /api/orders - Create new order
 * PUT /api/orders/:id - Update order
 * DELETE /api/orders/:id - Cancel order
 */
app.use('/api/orders', orderRoutes);

/**
 * Reservation Routes
 * GET /api/reservations - Get all reservations
 * POST /api/reservations - Create new reservation
 * PUT /api/reservations/:id - Update reservation
 * DELETE /api/reservations/:id - Cancel reservation
 */
app.use('/api/reservations', reservationRoutes);

/**
 * Employee Routes
 * GET /api/employees - Get all employees
 * POST /api/employees - Add new employee
 * PUT /api/employees/:id - Update employee info
 * DELETE /api/employees/:id - Remove employee
 */
app.use('/api/employees', employeeRoutes);

/**
 * Report Routes
 * GET /api/reports/sales - Get sales reports
 * GET /api/reports/inventory - Get inventory reports
 * GET /api/reports/performance - Get performance reports
 */
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
});

module.exports = app;