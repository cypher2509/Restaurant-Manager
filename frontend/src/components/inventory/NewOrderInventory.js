import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewInventoryOrder() {
    const [orderDetails, setOrderDetails] = useState({
        inventory_item_id: '',
        cost_per_unit: '',
        quantity: ''
    });
    const [inventoryItems, setInventoryItems] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Fetch inventory items on component mount
    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inventory');
                setInventoryItems(response.data); // Assume response.data is an array of items
            } catch (err) {
                setError('Failed to fetch inventory items.');
                console.error(err);
            }
        };

        fetchInventoryItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/inventory/order', orderDetails);

            if (response.data) {
                setSuccess('Inventory order created successfully.');
                setError('');
                setOrderDetails({
                    inventory_item_id: '',
                    cost_per_unit: '',
                    quantity: ''
                });
            }
        } catch (err) {
            setError('Failed to create the inventory order. Please try again.');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 inventoryOrderForm-container">
            <form onSubmit={handleSubmit}>
                <h1>Create Inventory Order</h1>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="inventory_item_id" className="form-label">Inventory Item</label>
                    <select
                        name="inventory_item_id"
                        id="inventory_item_id"
                        className="form-select"
                        value={orderDetails.inventory_item_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select an inventory item</option>
                        {inventoryItems.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="cost_per_unit" className="form-label">Cost Per Unit</label>
                    <input
                        type="number"
                        name="cost_per_unit"
                        id="cost_per_unit"
                        className="form-control"
                        value={orderDetails.cost_per_unit}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        className="form-control"
                        value={orderDetails.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Create Order</button>
            </form>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
        </div>
    );
}

export default NewInventoryOrder;
