CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- drop table order_items;
-- drop table inventory_usage;
-- drop table menu_items;
-- drop table orders;
-- drop table shifts;
-- drop TABLE employees;
-- drop table reservations;
-- drop table inventory_orders;
-- drop table inventory_items;
-- drop table restaurant_tables;
-- drop table customers;

select * from order_items;
-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
	is_available BOOLEAN DEFAULT TRUE, 
    price DECIMAL(10,2) NOT NULL,
    img VARCHAR(200),
    category VARCHAR(50) NOT NULL
);
-- do not change
INSERT INTO menu_items (name, description, img, price, category) VALUES
( 'Cheeseburger', 'A juicy burger with cheese, lettuce, and tomato.', 'https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?q=80&w=1265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 8.99, 'Main'),
('Margherita Pizza', 'Classic Italian pizza with fresh mozzarella and basil.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 12.49, 'Main'),
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons.', 'https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 7.99, 'Appetizer'),
('Grilled Chicken', 'Perfectly grilled chicken breast with a smoky flavor.', 'https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D', 10.99, 'Main'),
('Chocolate Cake', 'Rich and moist chocolate cake topped with ganache.', 'https://plus.unsplash.com/premium_photo-1715015440855-7d95cf92608a?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D', 5.99, 'Dessert'),
('Tacos', 'Soft-shell tacos filled with seasoned beef, lettuce, and cheese.', 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D', 9.49, 'Main');


-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY,
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
    id INT PRIMARY KEY,
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

-- Restaurant Tables Table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capacity INT NOT NULL,
    location VARCHAR(50),
	available BOOLEAN DEFAULT TRUE
);


-- donot change 
INSERT INTO restaurant_tables (capacity, location, available) VALUES
(2, 'Near Entrance', TRUE),        -- Table 1
(4, 'Window Seat', TRUE),          -- Table 2
(6, 'Middle Section', TRUE),       -- Table 3
(8, 'Corner Booth', TRUE),         -- Table 4
(10, 'Private Room', TRUE),        -- Table 5
(4, 'Patio Area', TRUE),           -- Table 6
(6, 'Bar Section', TRUE),          -- Table 7
(2, 'Rooftop View', TRUE),         -- Table 8
(8, 'Family Area', TRUE);          -- Table 9


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
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    name VARCHAR(255) NOT NULL,               
    quantity INT NOT NULL DEFAULT 0,          
    restock_threshold INT NOT NULL DEFAULT 30
);

CREATE TABLE if NOT EXISTS inventory_usage (
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
);

-- drop trigger check_and_update_inventory_on_order_item_insert;
DELIMITER //

CREATE TRIGGER update_menu_item_availability
AFTER UPDATE ON inventory_items
FOR EACH ROW
BEGIN
    -- Update the is_available status for menu items
    UPDATE menu_items AS mi
    SET mi.is_available = NOT EXISTS (
        SELECT 1
        FROM inventory_usage AS iu
        JOIN inventory_items AS ii ON iu.inventory_item_id = ii.id
        WHERE iu.menu_item_id = mi.id
          AND ii.quantity < iu.usage_quantity
    )
    WHERE mi.id IN (
        SELECT iu.menu_item_id
        FROM inventory_usage AS iu
        WHERE iu.inventory_item_id = NEW.id
    );
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER check_and_update_inventory_on_order_item_insert
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE menu_item_name VARCHAR(255); -- Declare a variable to store the menu item name

    -- Retrieve the menu item name
    SELECT name INTO menu_item_name
    FROM menu_items
    WHERE id = NEW.menu_item_id;

    -- Check if there is enough inventory for the menu item in the order
    IF EXISTS (
        SELECT 1
        FROM inventory_usage AS iu
        JOIN inventory_items AS ii ON iu.inventory_item_id = ii.id
        WHERE iu.menu_item_id = NEW.menu_item_id
          AND (ii.quantity - (iu.usage_quantity * NEW.quantity)) < 0
    ) THEN
        -- Construct and raise the error message
        SET @error_message = CONCAT(
            'Insufficient inventory to process the order item: ',
            menu_item_name
        );

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @error_message;
    END IF;

    -- If inventory is sufficient, proceed to update it
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

DELIMITER //

CREATE PROCEDURE GetAvailableTables(IN reservation_date DATE, IN reservation_time TIME, IN party_size INT)
BEGIN
    -- Return all tables that are available for the given date, time, and party size
    SELECT id AS table_id, capacity, location
    FROM restaurant_tables
    WHERE 
        id NOT IN (
            SELECT DISTINCT table_id
            FROM reservations
            WHERE date = reservation_date
              AND time = reservation_time
              AND status = 'confirmed'
        )
      AND capacity >= party_size;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_table_availability_on_reservation_status
AFTER UPDATE ON reservations
FOR EACH ROW
BEGIN
    -- When reservation is 'ongoing', set table to unavailable
    IF NEW.status = 'ongoing' THEN
        UPDATE restaurant_tables
        SET available = FALSE
        WHERE id = NEW.table_id;
    -- When reservation is 'completed' or 'cancelled', set table to available
    ELSEIF NEW.status IN ('completed', 'cancelled') THEN
        UPDATE restaurant_tables
        SET available = TRUE
        WHERE id = NEW.table_id;
    END IF;
END;
//

DELIMITER ;



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

CALL GetDailySales('2024-11-19');

CREATE VIEW view_customer_order_details AS
SELECT 
    c.id AS customer_id,
    c.first_name AS customer_first_name,
    c.last_name AS customer_last_name,
    c.contact_number AS customer_contact_number,
    c.email AS customer_email,
    o.id AS order_id,
    o.table_number AS order_table_number,
    o.status AS order_status,
    o.total_amount AS order_total_amount,
    o.created_at AS order_created_at,
    o.updated_at AS order_updated_at,
    oi.id AS order_item_id,
    oi.quantity AS order_item_quantity,
    mi.id AS menu_item_id,
    mi.name AS menu_item_name,
    mi.description AS menu_item_description,
    mi.price AS menu_item_price,
    mi.category AS menu_item_category
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.id;

CREATE TABLE IF NOT EXISTS shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_date DATE NOT NULL,
    shift_status ENUM('open', 'scheduled') DEFAULT 'open',
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);


-- transaction query for shifts table

USE restaurant_db;

-- Audit table for shift changes
CREATE TABLE shift_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_id INT,
    employee_id INT,
    action VARCHAR(50),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

DELIMITER //

-- Procedure to create a new shift
CREATE PROCEDURE CreateShift(
    IN p_employee_id INT,
    IN p_start_time TIME,
    IN p_end_time TIME,
    IN p_shift_date DATE,
    OUT p_shift_id INT,
    OUT p_status VARCHAR(50),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'ERROR';
        SET p_message = 'Error occurred while creating shift';
    END;

    START TRANSACTION;

    -- Validate employee exists
    IF NOT EXISTS (SELECT 1 FROM employees WHERE id = p_employee_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid employee ID';
    END IF;

    -- Validate times
    IF p_start_time >= p_end_time THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start time must be before end time';
    END IF;

    -- Check for overlapping shifts for the same employee
    IF EXISTS (
        SELECT 1 FROM shifts 
        WHERE employee_id = p_employee_id 
        AND shift_date = p_shift_date
        AND shift_status = 'scheduled'
        AND (
            (start_time <= p_end_time AND end_time >= p_start_time)
            OR (start_time >= p_start_time AND start_time <= p_end_time)
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee has overlapping shifts';
    END IF;

    -- Insert the shift
    INSERT INTO shifts (employee_id, start_time, end_time, shift_date, shift_status)
    VALUES (p_employee_id, p_start_time, p_end_time, p_shift_date, 'scheduled');

    SET p_shift_id = LAST_INSERT_ID();

    -- Record in history
    INSERT INTO shift_history (shift_id, employee_id, action, new_status)
    VALUES (p_shift_id, p_employee_id, 'CREATE', 'scheduled');

    COMMIT;
    SET p_status = 'SUCCESS';
    SET p_message = 'Shift created successfully';
END //

DELIMITER //
-- Procedure to reassign a shift to another employee
CREATE PROCEDURE ReassignShift(
    IN p_shift_id INT,
    IN p_new_employee_id INT,
    OUT p_status VARCHAR(50),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_old_employee_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'ERROR';
        SET p_message = 'Error occurred while reassigning shift';
    END;

    START TRANSACTION;

    -- Lock and get current employee
    SELECT employee_id INTO v_old_employee_id 
    FROM shifts 
    WHERE id = p_shift_id 
    FOR UPDATE;

    -- Validate shift exists
    IF v_old_employee_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift not found';
    END IF;

    -- Validate new employee exists
    IF NOT EXISTS (SELECT 1 FROM employees WHERE id = p_new_employee_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid new employee ID';
    END IF;

    -- Check for overlapping shifts for the new employee
    IF EXISTS (
        SELECT 1 FROM shifts 
        WHERE employee_id = p_new_employee_id 
        AND shift_date = (SELECT shift_date FROM shifts WHERE id = p_shift_id)
        AND shift_status = 'scheduled'
        AND id != p_shift_id
        AND (
            (start_time <= (SELECT end_time FROM shifts WHERE id = p_shift_id) 
             AND end_time >= (SELECT start_time FROM shifts WHERE id = p_shift_id))
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'New employee has overlapping shifts';
    END IF;

    -- Update the shift
    UPDATE shifts 
    SET employee_id = p_new_employee_id
    WHERE id = p_shift_id;

    -- Record in history
    INSERT INTO shift_history (shift_id, employee_id, action, old_status, new_status)
    VALUES (p_shift_id, p_new_employee_id, 'REASSIGN', 'scheduled', 'scheduled');

    COMMIT;
    SET p_status = 'SUCCESS';
    SET p_message = 'Shift reassigned successfully';
END //


DELIMITER //
-- Procedure to update shift times
CREATE PROCEDURE UpdateShiftTimes(
    IN p_shift_id INT,
    IN p_new_start_time TIME,
    IN p_new_end_time TIME,
    OUT p_status VARCHAR(50),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_employee_id INT;
    DECLARE v_shift_date DATE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'ERROR';
        SET p_message = 'Error occurred while updating shift times';
    END;

    START TRANSACTION;

    -- Lock and get shift details
    SELECT employee_id, shift_date INTO v_employee_id, v_shift_date
    FROM shifts 
    WHERE id = p_shift_id 
    FOR UPDATE;

    -- Validate shift exists
    IF v_employee_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift not found';
    END IF;

    -- Validate times
    IF p_new_start_time >= p_new_end_time THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start time must be before end time';
    END IF;

    -- Check for overlapping shifts
    IF EXISTS (
        SELECT 1 FROM shifts 
        WHERE employee_id = v_employee_id 
        AND shift_date = v_shift_date
        AND id != p_shift_id
        AND shift_status = 'scheduled'
        AND (
            (start_time <= p_new_end_time AND end_time >= p_new_start_time)
            OR (start_time >= p_new_start_time AND start_time <= p_new_end_time)
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'New times overlap with existing shifts';
    END IF;

    -- Update times
    UPDATE shifts 
    SET start_time = p_new_start_time,
        end_time = p_new_end_time
    WHERE id = p_shift_id;

    -- Record in history
    INSERT INTO shift_history (shift_id, employee_id, action, old_status, new_status)
    VALUES (p_shift_id, v_employee_id, 'UPDATE_TIMES', 'scheduled', 'scheduled');

    COMMIT;
    SET p_status = 'SUCCESS';
    SET p_message = 'Shift times updated successfully';
END //

-- Procedure to delete a shift
CREATE PROCEDURE DeleteShift(
    IN p_shift_id INT,
    OUT p_status VARCHAR(50),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_employee_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'ERROR';
        SET p_message = 'Error occurred while deleting shift';
    END;

    START TRANSACTION;

    -- Lock and get employee_id
    SELECT employee_id INTO v_employee_id
    FROM shifts 
    WHERE id = p_shift_id 
    FOR UPDATE;

    -- Validate shift exists
    IF v_employee_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift not found';
    END IF;

    -- Record in history before deletion
    INSERT INTO shift_history (shift_id, employee_id, action, old_status, new_status)
    VALUES (p_shift_id, v_employee_id, 'DELETE', 'scheduled', NULL);

    -- Delete the shift
    DELETE FROM shifts WHERE id = p_shift_id;

    COMMIT;
    SET p_status = 'SUCCESS';
    SET p_message = 'Shift deleted successfully';
END //

DELIMITER ;