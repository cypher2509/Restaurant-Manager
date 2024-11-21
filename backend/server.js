const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// Import database configuration
const db = require('./config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


// Basic route test
app.get('/', (req, res) => {
    res.json({ message: 'Restaurant Management System API' });
});

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const backupRoute = require('./routes/backupRoute');
const reservationRoutes = require('./routes/reservationRoutes');
// Route to get all tables

app.use('/menu', menuRoutes);

app.use('/inventory', inventoryRoutes);

app.use('/orders', orderRoutes);

app.use('/employees', employeeRoutes);

app.use('/reports', reportRoutes);

app.use('/backup', backupRoute);

app.use('/reservations', reservationRoutes);
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