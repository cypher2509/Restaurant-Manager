// config/db.js

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Liontail@16',
  multipleStatements: true
};

async function initializeDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection(dbConfig);
    
    // Create and use database
    await connection.query('CREATE DATABASE IF NOT EXISTS restaurant_db');
    await connection.query('USE restaurant_db');
    
    // Define tables with IF NOT EXISTS
    const createTables = `
    CREATE TABLE IF NOT EXISTS menu_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        table_number INT,
        status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT,
        menu_item_id INT,
        quantity INT NOT NULL,
        price_at_time DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100),
        customer_phone VARCHAR(20),
        date DATE NOT NULL,
        time TIME NOT NULL,
        party_size INT NOT NULL,
        status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    
    // Execute table creation
    await connection.query(createTables);
    
    console.log('Database check completed successfully');
    
    // Create and return a connection pool with the database selected
    return mysql.createPool({
      ...dbConfig,
      database: 'restaurant_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };