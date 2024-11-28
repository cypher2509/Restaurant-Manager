/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: customers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employees
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `hourly_wage` int NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: inventory_items
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `inventory_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `restock_threshold` int NOT NULL DEFAULT '30',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 28 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: inventory_orders
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `inventory_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_item_id` int NOT NULL,
  `cost_per_unit` int NOT NULL,
  `quantity` int NOT NULL,
  `order_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_item_id` (`inventory_item_id`),
  CONSTRAINT `inventory_orders_ibfk_1` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: inventory_usage
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `inventory_usage` (
  `menu_item_id` int NOT NULL,
  `inventory_item_id` int NOT NULL,
  `usage_quantity` int NOT NULL,
  PRIMARY KEY (`menu_item_id`, `inventory_item_id`),
  KEY `inventory_item_id` (`inventory_item_id`),
  CONSTRAINT `inventory_usage_ibfk_1` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_usage_ibfk_2` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: menu_items
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10, 2) NOT NULL,
  `img` varchar(200) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: order_items
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: orders
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `table_number` int DEFAULT NULL,
  `status` enum('pending', 'completed', 'priority') DEFAULT 'pending',
  `total_amount` decimal(10, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reservations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `table_id` int NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `party_size` int NOT NULL,
  `status` enum('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: restaurant_tables
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `restaurant_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `location` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: shifts
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `shift_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view_customer_order_details
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view_customer_order_details` AS
select
  `c`.`id` AS `customer_id`,
  `c`.`first_name` AS `customer_first_name`,
  `c`.`last_name` AS `customer_last_name`,
  `c`.`contact_number` AS `customer_contact_number`,
  `c`.`email` AS `customer_email`,
  `o`.`id` AS `order_id`,
  `o`.`table_number` AS `order_table_number`,
  `o`.`status` AS `order_status`,
  `o`.`total_amount` AS `order_total_amount`,
  `o`.`created_at` AS `order_created_at`,
  `o`.`updated_at` AS `order_updated_at`,
  `oi`.`id` AS `order_item_id`,
  `oi`.`quantity` AS `order_item_quantity`,
  `mi`.`id` AS `menu_item_id`,
  `mi`.`name` AS `menu_item_name`,
  `mi`.`description` AS `menu_item_description`,
  `mi`.`price` AS `menu_item_price`,
  `mi`.`category` AS `menu_item_category`
from
  (
  (
    (
    `customers` `c`
    join `orders` `o` on((`c`.`id` = `o`.`customer_id`))
    )
    join `order_items` `oi` on((`o`.`id` = `oi`.`order_id`))
  )
  join `menu_items` `mi` on((`oi`.`menu_item_id` = `mi`.`id`))
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: customers
# ------------------------------------------------------------

INSERT INTO
  `customers` (
    `id`,
    `first_name`,
    `last_name`,
    `contact_number`,
    `email`
  )
VALUES
  (
    1,
    'John',
    ' Doe',
    '123-456-7890',
    'john.doe@example.com'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: employees
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventory_items
# ------------------------------------------------------------

INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (1, 'Tomato Sauce', 50, 20);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (2, 'Mozzarella Cheese', 38, 10);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (3, 'Pepperoni', 30, 5);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (4, 'Romaine Lettuce', 40, 10);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (5, 'Caesar Dressing', 25, 5);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (6, 'Mozzarella', 0, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (7, 'Basil', 0, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (8, 'Cheese', 142, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (9, 'Bun', 55, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (10, 'Beef Patty', 108, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (11, 'Lettuce', 104, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (12, 'Tomato', 109, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (13, 'Mozzarella', 169, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (14, 'Pizza Dough', 157, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (15, 'Basil', 98, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (16, 'Tomato Sauce', 100, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (17, 'Romaine Lettuce', 104, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (18, 'Croutons', 93, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (19, 'Caesar Dressing', 66, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (20, 'Chicken Breast', 101, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (21, 'Spices', 92, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (22, 'Flour', 135, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (23, 'Cocoa Powder', 194, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (24, 'Sugar', 177, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (25, 'Eggs', 199, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (26, 'Taco Shell', 186, 30);
INSERT INTO
  `inventory_items` (`id`, `name`, `quantity`, `restock_threshold`)
VALUES
  (27, 'Beef', 53, 30);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventory_orders
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventory_usage
# ------------------------------------------------------------

INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (1, 1, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (1, 2, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (1, 3, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (1, 4, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (1, 5, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (2, 6, 3);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (2, 7, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (2, 8, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (2, 9, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (3, 10, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (3, 11, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (3, 12, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (4, 13, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (4, 14, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (5, 15, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (5, 16, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (5, 17, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (5, 18, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (6, 1, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (6, 4, 1);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (6, 19, 2);
INSERT INTO
  `inventory_usage` (
    `menu_item_id`,
    `inventory_item_id`,
    `usage_quantity`
  )
VALUES
  (6, 20, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: menu_items
# ------------------------------------------------------------

INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    1,
    'Cheeseburger',
    'A juicy burger with cheese, lettuce, and tomato.',
    8.99,
    'https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?q=80&w=1265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Mains'
  );
INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    2,
    'Margherita Pizza',
    'Classic Italian pizza with fresh mozzarella and basil.',
    12.49,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Mains'
  );
INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    3,
    'Caesar Salad',
    'Crisp romaine lettuce with Caesar dressing and croutons.',
    7.99,
    'https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Sides'
  );
INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    4,
    'Grilled Chicken',
    'Perfectly grilled chicken breast with a smoky flavor.',
    10.99,
    'https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Mains'
  );
INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    5,
    'Chocolate Cake',
    'Rich and moist chocolate cake topped with ganache.',
    5.99,
    'https://plus.unsplash.com/premium_photo-1715015440855-7d95cf92608a?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Deserts'
  );
INSERT INTO
  `menu_items` (
    `id`,
    `name`,
    `description`,
    `price`,
    `img`,
    `category`
  )
VALUES
  (
    6,
    'Tacos',
    'Soft-shell tacos filled with seasoned beef, lettuce, and cheese.',
    9.49,
    'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D',
    'Appetizers'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: order_items
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: orders
# ------------------------------------------------------------

INSERT INTO
  `orders` (
    `id`,
    `customer_id`,
    `table_number`,
    `status`,
    `total_amount`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    1,
    5,
    'pending',
    0.00,
    '2024-11-19 01:34:04',
    '2024-11-19 01:34:04'
  );
INSERT INTO
  `orders` (
    `id`,
    `customer_id`,
    `table_number`,
    `status`,
    `total_amount`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    1,
    1,
    'completed',
    29.99,
    '2024-11-19 12:00:00',
    '2024-11-19 01:36:51'
  );
INSERT INTO
  `orders` (
    `id`,
    `customer_id`,
    `table_number`,
    `status`,
    `total_amount`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    3,
    1,
    2,
    'completed',
    49.99,
    '2024-11-19 13:00:00',
    '2024-11-19 01:36:51'
  );
INSERT INTO
  `orders` (
    `id`,
    `customer_id`,
    `table_number`,
    `status`,
    `total_amount`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    4,
    1,
    3,
    'completed',
    69.99,
    '2024-11-19 14:00:00',
    '2024-11-19 01:36:51'
  );
INSERT INTO
  `orders` (
    `id`,
    `customer_id`,
    `table_number`,
    `status`,
    `total_amount`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    5,
    1,
    1,
    'pending',
    39.99,
    '2024-11-20 15:00:00',
    '2024-11-19 01:36:51'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reservations
# ------------------------------------------------------------

INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    1,
    1,
    1,
    '2024-11-19',
    '18:00:00',
    4,
    'confirmed',
    '2024-11-19 01:36:44'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    2,
    1,
    2,
    '2024-11-19',
    '19:00:00',
    6,
    'confirmed',
    '2024-11-19 01:36:44'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    3,
    1,
    3,
    '2024-11-19',
    '20:00:00',
    8,
    'confirmed',
    '2024-11-19 01:36:44'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    4,
    1,
    1,
    '2024-11-20',
    '18:00:00',
    4,
    'cancelled',
    '2024-11-19 01:36:44'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    5,
    1,
    1,
    '2024-11-19',
    '19:00:00',
    4,
    'confirmed',
    '2024-11-19 01:38:35'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    6,
    1,
    2,
    '2024-11-19',
    '19:00:00',
    6,
    'confirmed',
    '2024-11-19 01:38:35'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    7,
    1,
    3,
    '2024-11-19',
    '19:00:00',
    8,
    'confirmed',
    '2024-11-19 01:38:35'
  );
INSERT INTO
  `reservations` (
    `id`,
    `customer_id`,
    `table_id`,
    `date`,
    `time`,
    `party_size`,
    `status`,
    `created_at`
  )
VALUES
  (
    8,
    1,
    1,
    '2024-11-20',
    '19:00:00',
    4,
    'cancelled',
    '2024-11-19 01:38:35'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: restaurant_tables
# ------------------------------------------------------------

INSERT INTO
  `restaurant_tables` (`id`, `capacity`, `location`)
VALUES
  (1, 4, NULL);
INSERT INTO
  `restaurant_tables` (`id`, `capacity`, `location`)
VALUES
  (2, 6, NULL);
INSERT INTO
  `restaurant_tables` (`id`, `capacity`, `location`)
VALUES
  (3, 8, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: shifts
# ------------------------------------------------------------


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
