-- This is the sample sql data I've been using to test routes out.

USE restaurant_db;

-- Insert menu items
INSERT INTO menu_items (name, description, price, category, is_available)
VALUES
('Cheeseburger', 'A juicy burger with cheese, lettuce, and tomato.', 8.99, 'Main Course', true),
('Margherita Pizza', 'Classic Italian pizza with fresh mozzarella and basil.', 12.49, 'Main Course', true),
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons.', 7.99, 'Salads', true),
('Grilled Chicken', 'Perfectly grilled chicken breast with a smoky flavor.', 10.99, 'Main Course', true),
('Chocolate Cake', 'Rich and moist chocolate cake topped with ganache.', 5.99, 'Desserts', true),
('Tacos', 'Soft-shell tacos filled with seasoned beef, lettuce, and cheese.', 9.49, 'Main Course', true);


INSERT INTO customers (customer_name, customer_email, customer_phone)
VALUES 
    ('John Smith', 'john.smith@example.com', '123-456-7890'),
    ('Emily Davis', 'emily.davis@example.com', '234-567-8901'),
    ('Michael Brown', 'michael.brown@example.com', '345-678-9012'),
    ('Sarah Johnson', 'sarah.johnson@example.com', '456-789-0123'),
    ('David Wilson', 'david.wilson@example.com', '567-890-1234');

INSERT INTO orders (table_number, status, total_amount)
VALUES
    (1, 'pending', 25.47),
    (2, 'preparing', 40.96),
    (3, 'ready', 18.99),
    (4, 'delivered', 32.99),
    (5, 'pending', 28.47);


INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) 
VALUES
(1, 1, 2, 15.50),  -- Order 1: 2 items of Menu ID 1
(1, 2, 1, 10.25),  -- Order 1: 1 item of Menu ID 2
(2, 3, 3, 20.00),  -- Order 2: 3 items of Menu ID 3
(3, 4, 1, 30.00),  -- Order 3: 1 item of Menu ID 4
(4, 5, 2, 25.00),  -- Order 4: 2 items of Menu ID 5
(5, 6, 1, 40.00),  -- Order 5: 1 item of Menu ID 6
(6, 7, 4, 12.00),  -- Order 6: 4 items of Menu ID 7
(7, 8, 2, 22.50),  -- Order 7: 2 items of Menu ID 8
(8, 9, 3, 18.75),  -- Order 8: 3 items of Menu ID 9
(9, 10, 1, 50.00); -- Order 9: 1 item of Menu ID 10

-- Get the order_id of the inserted order
SET @order_id = LAST_INSERT_ID();

-- Insert the order items into the OrderItems table
INSERT INTO OrderItems (order_id, menu_item_id, quantity, price)
VALUES
(@order_id, 8, 2, 20.49),  -- BBQ Ribs
(@order_id, 9, 1, 35.99),  -- Steak
(@order_id, 10, 3, 4.99);  -- Fries

-- Update the Menu table to decrease the inventory quantities based on the order
UPDATE menu_items
SET Quantity = Quantity - 2
WHERE menu_item_id = 8;  -- BBQ Ribs

UPDATE menu_items
SET Quantity = Quantity - 1
WHERE menu_item_id = 9;  -- Steak

UPDATE menu_items
SET Quantity = Quantity - 3
WHERE menu_item_id = 10;  -- Fries
