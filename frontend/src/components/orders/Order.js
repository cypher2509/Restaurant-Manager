import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./order.css"



function Order(){
    const [orders, setOrders] = useState([]);
    const [pending_orders_count, setPending_orders_count] = useState(0);
    const [completed_orders_count, setCompleted_orders_count] = useState(0);
    const [priority_orders_count, setPriority_orders_count] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        // Define the three requests
        const fetchPending = axios.get('http://localhost:3000/orders/pending');
        const fetchCompleted = axios.get('http://localhost:3000/orders/completed');
        const fetchPriority = axios.get('http://localhost:3000/orders/priority');

        // Use Promise.all to run requests concurrently
        Promise.all([fetchPending, fetchCompleted, fetchPriority])
            .then(([pendingRes, completedRes, priorityRes]) => {
                console.log(pendingRes.data.length)
                setPending_orders_count(pendingRes.data.length);
                setCompleted_orders_count(completedRes.data.length);
                setPriority_orders_count(priorityRes.data.length)
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError(err);
                setLoading(false);
            });
    }, []);
    return(
        <div className="order-container">
            <div className="order-stats">
                <div className="pending-orders">
                    pending orders <p>{pending_orders_count}</p>
                </div>
                <div className="priority-orders">
                    priority orders <p>{priority_orders_count} </p>
                </div>
                <div className="completed-orders"> 
                    completed orders <p>{completed_orders_count}</p>
                </div>
            </div>
            <div className="order-table">
                <h1>orders</h1>
                <div className='orders'>
                </div>
            </div>
        </div>
        
        
    )
}

export default Order;