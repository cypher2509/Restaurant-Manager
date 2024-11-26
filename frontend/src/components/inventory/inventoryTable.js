import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './inventoryTable.css';

function InventoryTable() {
    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inventory'); // Replace with your actual API endpoint
                setInventoryItems(response.data);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };

        fetchInventoryData();
    }, []);

    return (
        <div className="inventory-table-container">
            <h1>Inventory Items</h1>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Restock Threshold</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.restock_threshold}</td>
                            <td>
                                {item.quantity <= item.restock_threshold ? (
                                    <span className="status low-stock">Low Stock</span>
                                ) : (
                                    <span className="status in-stock">In Stock</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryTable;
