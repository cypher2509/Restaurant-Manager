import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./order.css";

function Order(){
    const [orders, setOrders] = useState([]);
    const [pending_orders, setPending_orders] = useState([]);
    const [completed_orders, setCompleted_orders] = useState([]);
    const [priority_orders, setPriority_orders] = useState([]);
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
                setPending_orders(pendingRes.data);
                setCompleted_orders(completedRes.data);
                setPriority_orders(priorityRes.data);
                console.log(priorityRes.data)
                setPending_orders_count(pendingRes.data.length);
                setCompleted_orders_count(completedRes.data.length);
                setPriority_orders_count(priorityRes.data.length);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching');
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
                <div className="table-header">
                    <h1>orders</h1> 
                    <form action="/customerCheck/order" method="get">
                        <button className='btn-add'><i class="fa-solid fa-plus"></i></button>
                    </form>
                
                </div>
                <table className="table table-striped">
                <thead>
                        <th>#</th>
                        <th>table number</th>
                        <th>status</th>
                        <th>total amount</th>
                    </thead>
                    <tbody>
                    {priority_orders.map(order =>(
                        <tr>
                            <td><a style={{textDecoration:"none"}} href={`/order/${order.id}`}>{order.id} <i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a></td>
                            <td >{order.table_number}</td>
                            <td className='priority-orders-list'>{order.status}</td>
                            <td >{order.total_amount}</ td>
                        </tr>
                    ))}
                     {pending_orders.map(order =>(
                        <tr >
                            <td><a style={{textDecoration:"none"}} href={`/order/${order.id}`}>{order.id} <i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i> </a></td>
                            <td >{order.table_number}</td>
                            <td  className='pending-orders-list'>{order.status}</td>
                            <td >{order.total_amount}</td>
                        </tr>
                    ))}
                     {completed_orders.map(order =>(
                        <tr >
                            <td><a style={{textDecoration:"none"}} href={`/order/${order.id}`}>{order.id} <i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a></td>
                            <td >{order.table_number}</td>
                            <td className='completed-orders-list'>{order.status}</td>
                            <td >{order.total_amount}</td>
                        </tr>
                    ))}
                    </tbody>
                    
                </table>    
            </div>
            <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
            />
        </div>
    )
}

export default Order;