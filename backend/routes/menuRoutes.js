// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route GET /api/menu
 * @description Get all menu items
 */

router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu_items'); 
        res.json(rows); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});



router.get('/:id', async (req, res, next) => {
    try {
        const id = [req.params.id]
        const query1 = 'SELECT * FROM menu_items WHERE id = ?';
        const [menu_details] = await db.query(query1, id); 
        const query2 = 'SELECT * FROM inventory_usage WHERE menu_item_id= ?'
        const [item_contents] = await db.query(query2, id);
        console.log(menu_details); // Log the result
        res.json({details: menu_details,contents:item_contents} ); // Send the data as JSON
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});


router.post('/', async (req, res, next) => {
    const { name, description, price, category, ingredients } = req.body;

    if (!name || !price || !category || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }
    try {
        const query1 = 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)';
        const [menuResult] = await db.query(query1, [name, description, price, category]);
        const menuItemId = menuResult.insertId; 
        
        // Process ingredients
        for (const ingredient of ingredients) {
            const { name: ingredientName, quantity } = ingredient;

            if (!ingredientName || !quantity) {
                throw new Error('Ingredient name and quantity are required');
            }

            // Check if the inventory item exists
            const query2 = 'SELECT id FROM inventory_items WHERE name = ?';
            const [inventoryCheck] = await db.query(query2, [ingredientName]);
            let inventoryItemId;

            if (inventoryCheck.length > 0) {
                // Inventory item exists, get its ID
                inventoryItemId = inventoryCheck[0].id;
            } else {
                // Insert new inventory item if it doesn't exist
                const query3 = 'INSERT INTO inventory_items (name) VALUES (?)';
                const [inventoryResult] = await db.query(query3, [ingredientName]);
                inventoryItemId = inventoryResult.insertId;
            }

            // Insert into `inventory_usage` table
            const query4 = 'INSERT INTO inventory_usage (menu_item_id, inventory_item_id, usage_quantity) VALUES (?, ?, ?)';
            await db.query(query4, [menuItemId, inventoryItemId, quantity]);
        }
        res.status(201).json({ message: 'Menu item and inventory usage created successfully' });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    } 
});


/**
 * @route PUT /api/menu/:id
 * @description Update a menu item
 */
router.put('/:id', async (req, res, next) => {
    const { id } = req.params; // Menu item ID to update
    const { name, description, price, category, ingredients } = req.body;

    if (!id || !name || !price || !category || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    try {
        // Update the menu item details
        const query1 = 'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ? WHERE id = ?';
        await db.query(query1, [name, description, price, category, id]);

        // Fetch the current inventory usage for this menu item
        const query2 = 'SELECT inventory_item_id FROM inventory_usage WHERE menu_item_id = ?';
        const [currentUsage] = await db.query(query2, [id]);
        const currentInventoryIds = currentUsage.map((row) => row.inventory_item_id);

        // Process ingredients
        for (const ingredient of ingredients) {
            const { name: ingredientName, quantity } = ingredient;

            if (!ingredientName || !quantity) {
                throw new Error('Ingredient name and quantity are required');
            }

            // Check if the inventory item exists
            const query3 = 'SELECT id FROM inventory_items WHERE name = ?';
            const [inventoryCheck] = await db.query(query3, [ingredientName]);
            let inventoryItemId;

            if (inventoryCheck.length > 0) {
                // Inventory item exists, get its ID
                inventoryItemId = inventoryCheck[0].id;
            } else {
                // Insert new inventory item if it doesn't exist
                const query4 = 'INSERT INTO inventory_items (name) VALUES (?)';
                const [inventoryResult] = await db.query(query4, [ingredientName]);
                inventoryItemId = inventoryResult.insertId;
            }

            // Check if the ingredient is already in `inventory_usage`
            if (!currentInventoryIds.includes(inventoryItemId)) {
                // Insert new inventory usage
                const query5 = 'INSERT INTO inventory_usage (menu_item_id, inventory_item_id, usage_quantity) VALUES (?, ?, ?)';
                await db.query(query5, [id, inventoryItemId, quantity]);
            } else {
                // Update existing inventory usage
                const query6 = 'UPDATE inventory_usage SET usage_quantity = ? WHERE menu_item_id = ? AND inventory_item_id = ?';
                await db.query(query6, [quantity, id, inventoryItemId]);

                // Remove from the current inventory IDs list (to track which items are still relevant)
                currentInventoryIds.splice(currentInventoryIds.indexOf(inventoryItemId), 1);
            }
        }

        // Delete inventory usage for ingredients that are no longer used
        if (currentInventoryIds.length > 0) {
            const query7 = 'DELETE FROM inventory_usage WHERE menu_item_id = ? AND inventory_item_id IN (?)';
            await db.query(query7, [id, currentInventoryIds]);
        }

        res.json({ message: 'Menu item and inventory usage updated successfully' });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});


/**
 * @route DELETE /api/menu/:id
 * @description Delete a menu item
 */
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params; // Menu item ID to delete

    if (!id) {
        return res.status(400).json({ error: 'Menu item ID is required' });
    }

    try {
        const query = 'DELETE FROM menu_items WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.json({ message: 'Menu item and associated inventory usage deleted successfully' });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});


module.exports = router;