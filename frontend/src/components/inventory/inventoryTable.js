import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './inventoryTable.css';

function InventoryTable() {
    const [inventoryItems, setInventoryItems] = useState([]);

    document.body.style.backgroundColor = '#f9f9f9';

    useEffect(()=>{
        const fetchInventoryData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inventory'); // Replace with your actual API endpoint
                setInventoryItems(response.data);
                console.log('fetching inventory data')
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };
    
        fetchInventoryData();
    },[])

    return (
        <div className="inventory-container col-8 offset-2">
            <h1>Stock</h1>
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

            <div className='order-actions'>
                <form action='/inventory/ordered'>
                        <button className='order-btn btn btn-primary'>check ordered inventory</button>
                </form>
                <form action='/inventory/ordered/new'>
                        <button className='order-btn btn btn-primary'>order inventory</button>
                </form >
            </div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>

        </div>
    );
}

export default InventoryTable;
