CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

drop table order_items;
drop table inventory_usage;
drop table menu_items;
drop table orders;
drop TABLE employees;
drop table reservations;
drop table inventory_items;



-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    table_number INT,
    status ENUM('pending', 'completed', 'priority') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order Items Table (many-to-many relationship between orders and menu items)
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    hourly_wage INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    table_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INT NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    table_id INT,  -- Adding the table_id column
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);


-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE,
);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    name VARCHAR(255) NOT NULL,               
    quantity INT NOT NULL DEFAULT 0,          
    restock_threshold INT NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS inventory_usage (
    menu_item_id INT NOT NULL,                 
    inventory_item_id INT NOT NULL,           
    usage_quantity INT NOT NULL,              
    PRIMARY KEY (menu_item_id, inventory_item_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_orders(
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id INT NOT NULL,
    cost_per_unit INT NOT NULL,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
)

-- Restaurant Tables Table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capacity INT NOT NULL,
    location VARCHAR(50)
);

-- Shifts Table
CREATE TABLE IF NOT EXISTS shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER update_inventory_on_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    -- Update each inventory item associated with the menu item in the order
    UPDATE inventory_items AS ii
    SET ii.quantity = ii.quantity - (
        SELECT iu.usage_quantity * NEW.quantity
        FROM inventory_usage AS iu
        WHERE iu.inventory_item_id = ii.id
          AND iu.menu_item_id = NEW.menu_item_id
    )
    WHERE EXISTS (
        SELECT 1
        FROM inventory_usage AS iu
        WHERE iu.inventory_item_id = ii.id
          AND iu.menu_item_id = NEW.menu_item_id
    );
END;
//

DELIMITER ;



INSERT INTO menu_items (name, description, price, category) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce and mozzarella', 8.99, 'Pizza'),
('Pepperoni Pizza', 'Spicy pepperoni with mozzarella and tomato sauce', 9.99, 'Pizza'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 7.50, 'Salad');

INSERT INTO inventory_items (name, quantity, restock_threshold) VALUES
('Tomato Sauce', 100, 20),
('Mozzarella Cheese', 50, 10),
('Pepperoni', 30, 5),
('Romaine Lettuce', 40, 10),
('Caesar Dressing', 25, 5);

-- Margherita Pizza
INSERT INTO inventory_usage (menu_item_id, inventory_item_id, usage_quantity) VALUES
(1, 1, 2),  -- 2 units of Tomato Sauce
(1, 2, 3);  -- 3 units of Mozzarella Cheese

-- Pepperoni Pizza
INSERT INTO inventory_usage (menu_item_id, inventory_item_id, usage_quantity) VALUES
(2, 1, 2),  -- 2 units of Tomato Sauce
(2, 2, 3),  -- 3 units of Mozzarella Cheese
(2, 3, 5);  -- 5 units of Pepperoni

-- Caesar Salad
INSERT INTO inventory_usage (menu_item_id, inventory_item_id, usage_quantity) VALUES
(3, 4, 1),  -- 1 unit of Romaine Lettuce
(3, 5, 1);  -- 1 unit of Caesar Dressing

INSERT INTO customers (name, contact_no, email) VALUES
('John Doe', '123-456-7890', 'john.doe@example.com');

INSERT INTO orders (customer_id, table_number, status, total_amount) VALUES
(1, 5, 'pending', 0.00);

-- Ordering 2 Margherita Pizzas
INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES
(1, 1, 4);

-- Stored Procedure to get daily sales for the date 
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

-- SQL Function to check table availability 
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


