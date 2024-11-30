USE restaurant_db;

-- Annual Revenue
DELIMITER $$

CREATE PROCEDURE GetAnnualRevenue(IN year INT)
BEGIN
    SELECT 
        YEAR(o.created_at) AS Year,
        COUNT(o.id) AS TotalOrders,
        SUM(o.total_amount) AS TotalRevenue
    FROM orders o
    WHERE YEAR(o.created_at) = year
    GROUP BY YEAR(o.created_at);
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE GetMonthlyRevenue(IN year INT)
BEGIN
    SELECT 
        YEAR(o.created_at) AS Year,
        MONTH(o.created_at) AS Month,
        COUNT(o.id) AS TotalOrders,
        SUM(o.total_amount) AS TotalRevenue
    FROM orders o
    WHERE YEAR(o.created_at) = year
    GROUP BY YEAR(o.created_at), MONTH(o.created_at)
    ORDER BY Year, Month;
END $$
DELIMITER ;

drop procedure gettopperformingDays;
DELIMITER $$

CREATE PROCEDURE GetTopPerformingDays(IN year INT)
BEGIN
    SELECT 
        DATE(o.created_at) AS SaleDate,
        COUNT(o.id) AS TotalOrders,
        SUM(o.total_amount) AS TotalRevenue
    FROM orders o
    WHERE YEAR(o.created_at) = year
    GROUP BY DATE(o.created_at)
	ORDER BY TotalRevenue DESC
    LIMIT 5;
END $$

DELIMITER ;

CALL GetTopPerformingDays(2024);

DELIMITER $$

CREATE FUNCTION GetTopSpendingCustomer(
    year INT,       -- Year for which the top spending customer is calculated
    month INT       -- Month for which the top spending customer is calculated
) 
RETURNS VARCHAR(255)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE top_customer_name VARCHAR(255);
    DECLARE top_customer_spent DECIMAL(10,2);
    
    -- Find the top spending customer for the specified month and year
    SELECT 
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name, 
        SUM(o.total_amount) AS total_spent
    INTO top_customer_name, top_customer_spent
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE YEAR(o.created_at) = year
    AND MONTH(o.created_at) = month
    GROUP BY c.id
    ORDER BY total_spent DESC
    LIMIT 1;

    -- Return the top customer details
    IF top_customer_name IS NOT NULL THEN
        RETURN CONCAT(top_customer_name, ' with total spending: $', top_customer_spent);
    ELSE
        RETURN 'No customer data available for the specified month and year.';
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetTopSpendingCustomers(IN year INT)
BEGIN
    SELECT 
        CONCAT(c.first_name, ' ', c.last_name) AS CustomerName,
        COUNT(o.id) AS TotalOrders,
        SUM(o.total_amount) AS TotalSpent
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE YEAR(o.created_at) = year
    GROUP BY c.id
    ORDER BY TotalSpent DESC
    LIMIT 10;
END $$

DELIMITER ;

drop procedure gettotalordersbyday;
DELIMITER $$

CREATE PROCEDURE getTotalOrdersByDay(IN year INT)
BEGIN
    SELECT 
        DAYNAME(created_at) AS day_of_week,
        COUNT(*) AS total_orders
    FROM 
        orders
         WHERE 
	YEAR(created_at) = year
    GROUP BY 
        day_of_week;
END$$

DELIMITER ;

call gettotalordersbyday(2024);

-- Repeat customers
DELIMITER $$

CREATE PROCEDURE GetRepeatCustomers(IN year INT)
BEGIN
    SELECT 
        CONCAT(c.first_name, ' ', c.last_name) AS CustomerName,
        COUNT(o.id) AS TotalOrders
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE YEAR(o.created_at) = year
    GROUP BY c.id
    HAVING TotalOrders > 1
    ORDER BY TotalOrders DESC;
END $$

DELIMITER ;


