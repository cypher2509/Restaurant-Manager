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

const tables = [
    { id: 1, number: 1, isBooked: true },
    { id: 2, number: 2, isBooked: false },
    { id: 3, number: 3, isBooked: false },
    { id: 4, number: 4, isBooked: true },
    { id: 5, number: 5, isBooked: true },
    { id: 6, number: 6, isBooked: false },
    // Add more tables as needed
];

// Route to get all tables
app.get('/tables', (req, res) => {
    res.json(tables);
});
/**
 * Menu Routes
 * GET /api/menu - Get all menu items
 * POST /api/menu - Add new menu item
 * PUT /api/menu/:id - Update menu item
 * DELETE /api/menu/:id - Remove menu item
 */
app.use('/menu', menuRoutes);

app.use('/inventory', inventoryRoutes);
/**
 * Order Routes
 * GET /api/orders - Get all orders
 * POST /api/orders - Create new order
 * PUT /api/orders/:id - Update order
 * DELETE /api/orders/:id - Cancel order
 */
const orderDetails = [
    {
      "id": 1,
      "customer_name": "John Doe",
      "employee_id": "E123",
      "table_number": "5",
      "total_amount": 120.75,
      "date": "2024-11-17T14:45:30.000Z",
      "status": "pending",
      "items": [
        {
          "id": 1,
          "name": "Cheeseburger",
          "quantity": 2,
          "price": 8.99
        },
        {
          "id": 2,
          "name": "Margherita Pizza",
          "quantity": 1,
          "price": 12.49
        }
      ]
    },
    {
      "id": 2,
      "customer_name": "Jane Smith",
      "employee_id": "E456",
      "table_number": "3",
      "total_amount": 75.50,
      "date": "2024-11-16T13:30:00.000Z",
      "status": "completed",
      "items": [
        {
          "id": 3,
          "name": "Caesar Salad",
          "quantity": 3,
          "price": 7.99
        },
        {
          "id": 4,
          "name": "Grilled Chicken",
          "quantity": 1,
          "price": 10.99
        }
      ]
    },
    {
      "id": 3,
      "customer_name": "Alice Johnson",
      "employee_id": "E789",
      "table_number": "8",
      "total_amount": 92.99,
      "date": "2024-11-17T17:15:00.000Z",
      "status": "priority",
      "items": [
        {
          "id": 5,
          "name": "Chocolate Cake",
          "quantity": 4,
          "price": 5.99
        },
        {
          "id": 6,
          "name": "Tacos",
          "quantity": 2,
          "price": 9.49
        }
      ]
    },
    {
      "id": 4,
      "customer_name": "Mark Brown",
      "employee_id": "E234",
      "table_number": "2",
      "total_amount": 45.97,
      "date": "2024-11-17T12:00:00.000Z",
      "status": "pending",
      "items": [
        {
          "id": 7,
          "name": "Grilled Cheese Sandwich",
          "quantity": 3,
          "price": 5.99
        }
      ]
    },
    {
      "id": 5,
      "customer_name": "Emily Davis",
      "employee_id": "E345",
      "table_number": "10",
      "total_amount": 150.25,
      "date": "2024-11-17T18:45:00.000Z",
      "status": "completed",
      "items": [
        {
          "id": 8,
          "name": "BBQ Ribs",
          "quantity": 2,
          "price": 20.49
        },
        {
          "id": 9,
          "name": "Steak",
          "quantity": 1,
          "price": 35.99
        },
        {
          "id": 10,
          "name": "Fries",
          "quantity": 3,
          "price": 4.99
        }
      ]
    }
  ]

// Endpoint to get all pending orders
app.get('/orders/pending', (req, res) => {
    const pendingOrders = orderDetails.filter(order => order.status === 'pending');
    res.json(pendingOrders);
});

// Endpoint to get all completed orders
app.get('/orders/completed', (req, res) => {
    const completedOrders = orderDetails.filter(order => order.status === 'completed');
    res.json(completedOrders);
});

app.get('/orders/priority', (req,res) => {
    const  priorityOrders = orderDetails.filter(order => order.status ==='priority');
    res.json(priorityOrders);
} )


app.use('/orders', orderRoutes);

const scheduledReservations = [
    { id: 1, name: 'Reservation A', time: '10:00 AM' },
    { id: 2, name: 'Reservation B', time: '12:00 PM' },
    { id: 3, name: 'Reservation C', time: '2:00 PM' }
];

const completedReservations = [
    { id: 1, name: 'Reservation D', time: '9:00 AM' },
    { id: 2, name: 'Reservation E', time: '11:00 AM' }
];

const availableReservations = [
    { id: 1, name: 'Reservation F', time: '3:00 PM' },
    { id: 2, name: 'Reservation G', time: '4:00 PM' },
    { id: 3, name: 'Reservation H', time: '5:00 PM' },
    { id: 4, name: 'Reservation I', time: '6:00 PM' }
];

// Endpoints
app.get('/reservations/scheduled', (req, res) => {
    res.json(scheduledReservations);
});

app.get('/reservations/completed', (req, res) => {
    res.json(completedReservations);
});

app.get('/reservations/available', (req, res) => {
    res.json(availableReservations);
});

const menuItems =[
    {
      id: 1,
      name: "Cheeseburger",
      description: "A juicy burger with cheese, lettuce, and tomato.",
      img: "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?q=80&w=1265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 8.99
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Classic Italian pizza with fresh mozzarella and basil.",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 12.49
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing and croutons.",
      img: "https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 7.99
    },
    {
      id: 4,
      name: "Grilled Chicken",
      description: "Perfectly grilled chicken breast with a smoky flavor.",
      img: "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 10.99
    },
    {
      id: 5,
      name: "Chocolate Cake",
      description: "Rich and moist chocolate cake topped with ganache.",
      img: "https://plus.unsplash.com/premium_photo-1715015440855-7d95cf92608a?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 5.99
    },
    {
      id: 6,
      name: "Tacos",
      description: "Soft-shell tacos filled with seasoned beef, lettuce, and cheese.",
      img: "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 9.49
    }
  ];
  
  // API endpoint to get menu items
  app.get('/menu', (req, res) => {
    res.json(menuItems);
  });
  

/**
 * Reservation Routes
 * GET /api/reservations - Get all reservations
 * POST /api/reservations - Create new reservation
 * PUT /api/reservations/:id - Update reservation
 * DELETE /api/reservations/:id - Cancel reservation
 */
// app.use('/api/reservations', reservationRoutes);

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