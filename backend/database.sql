-- Create the database and switch to it
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Menu Items Table
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number INT,
    status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table (many-to-many relationship between orders and menu items)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Employees Table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INT NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    loyalty_points INT DEFAULT 0
);

-- Inventory Items Table
CREATE TABLE inventory_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL
);

-- Restaurant Tables Table
CREATE TABLE restaurant_tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capacity INT NOT NULL,
    location VARCHAR(50)
);

-- Shifts Table
CREATE TABLE shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Uses Table (tracks usage of inventory items in orders)
CREATE TABLE uses (
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_used INT NOT NULL,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Contains Table (tracks items contained within orders)
CREATE TABLE contains (
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

--Stored Procedure to get daily sales for the date 
DELIMITER //

CREATE PROCEDURE GetDailySales(IN sales_date DATE)
BEGIN
    SELECT 
        DATE(created_at) AS SaleDate, 
        COUNT(id) AS TotalOrders, 
        SUM(total_amount) AS TotalSales
    FROM 
        orders
    WHERE 
        DATE(created_at) = sales_date
    GROUP BY 
        SaleDate;
END //

DELIMITER ;

-- SQL Function to Check Table Availabilty 
DELIMITER //

CREATE FUNCTION CheckTableAvailability(reservation_date DATE, reservation_time TIME, party_size INT)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE available_capacity INT;

    -- Calculate total capacity of unreserved tables
    SELECT 
        SUM(capacity)
    INTO 
        available_capacity
    FROM 
        restaurant_tables
    WHERE 
        id NOT IN (
            SELECT DISTINCT table_id
            FROM reservations
            WHERE date = reservation_date 
            AND time = reservation_time
            AND status = 'confirmed'
        );

    -- Return TRUE if enough capacity is available
    IF available_capacity > party_size THEN 
		return TRUE; 
	else
		return False; 
	end if; 
END //

DELIMITER ;