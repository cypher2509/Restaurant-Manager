import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams,useNavigate } from 'react-router-dom';

import MenuItem from '../menu/MenuItem'; // Import the MenuItem component

import "./editOrder.css";

function EditOrder() {
    const { id } = useParams(); // Get order ID from the URL
    const [orderData, setOrderData] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [status, setStatus] = useState();
    const [customerId, setCustomerId] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderedItems, setOrderedItems] = useState([]);
    const navigate = useNavigate();
    // Fetch order data and menu items on component mount
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderResponse = await axios.get(`http://localhost:3000/orders/${id}`);
                const orderDetails = orderResponse.data;

                const {
                    customer_id,
                    order_table_number,
                    order_status,
                    order_total_amount,
                } = orderDetails[0];

                setOrderData(orderDetails);
                setCustomerId(customer_id);
                setTableNumber(order_table_number);
                setStatus(order_status);
                setTotalAmount(parseFloat(order_total_amount));

                const items = orderDetails.map((item) => ({
                    id: item.menu_item_id,
                    name: item.menu_item_name,
                    description: item.menu_item_description,
                    price: parseFloat(item.menu_item_price),
                    category: item.menu_item_category,
                    quantity: item.order_item_quantity,
                }));
                setOrderedItems(items);

                const menuResponse = await axios.get('http://localhost:3000/menu');
                setMenuItems(menuResponse.data);
            } catch (err) {
                console.error('Error fetching order data:', err);
            }
        };

        fetchOrderData();
    }, [id]);

    // Add a new menu item to the order
    const addMenuItem = (item) => {
        const existingItem = orderedItems.find((orderedItem) => orderedItem.id === item.id);
        console.log(existingItem)
        if (existingItem) {
            setOrderedItems((prevItems) =>
                prevItems.map((orderedItem) =>
                    orderedItem.id === item.id
                        ? { ...orderedItem, quantity: orderedItem.quantity + 1 }
                        : orderedItem
                )
            );
        } else {
            setOrderedItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
        }
        setTotalAmount((prevTotal) => prevTotal + parseFloat(item.price));
    };

    // Remove an item from the order
    const removeMenuItem = (itemId) => {
        setOrderedItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
        );
        const removedItem = orderedItems.find((item) => item.id === itemId);
        setTotalAmount((prevTotal) => prevTotal - (removedItem.price * removedItem.quantity));
    };

    // Update the order
    const updateOrder = async (e) => {
        e.preventDefault();
        const updatedOrder = {
            customer_id: customerId,
            table_number: tableNumber,
            total_amount: totalAmount.toFixed(2),
            items: orderedItems,
            status,
        };

        try {
            const response = await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
            alert('Order updated successfully!');
            console.log('Updated order:', response.data);
            navigate('/');
        } catch (err) {
            console.error('Error updating order:', err);
            alert('Failed to update the order.');
        }
    };

    return (
        <div className="editOrder-container">
            {orderData ? (
                <form onSubmit={updateOrder} className="editOrder-form col-6 offset-3">
                    <h1>Edit Order</h1>

                    <div className="mb-3">
                        <label htmlFor="customer_id" className="form-label">Customer ID</label>
                        <input
                            type="text"
                            id="customer_id"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="table_number" className="form-label">Table Number</label>
                        <input
                            type="text"
                            id="table_number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Order Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <h3>Ordered Items</h3>
                    <ul className="ordered-items-list">
                        {orderedItems.map((item) => (
                            <li key={item.id} className="ordered-item">
                                <span>{item.name}</span>
                                <span>Quantity: {item.quantity}</span>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeMenuItem(item.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3>Add Menu Items</h3>
                    <div className="menu-items" style={{display: 'flex'}}>
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                name={item.name}
                                description={item.description}
                                img={item.img}
                                onAdd={() => addMenuItem(item)} // Pass the addMenuItem function as a prop
                            />
                        ))}
                    </div>



                    <div className="summary">
                        <div>Order Total: ${totalAmount.toFixed(2)}</div>
                        <button type="submit" className="btn btn-success">Update Order</button>
                        <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={async () => {
                            try {
                                await axios.delete(`http://localhost:3000/orders/${id}`);
                                alert('Order deleted successfully!');
                                navigate('/'); // Redirect to the homepage or orders list
                            } catch (err) {
                                console.error('Error deleting order:', err);
                                alert('Failed to delete the order.');
                            }
                        }}
                        >
                            Delete Order
                        </button>

                    </div>
                </form>
            ) : (
                <p>Loading order details...</p>
            )}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
        </div>
    );
}

export default EditOrder;
