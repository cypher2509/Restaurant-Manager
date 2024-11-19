import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./editOrder.css";

function EditOrder(){
    const [menuItems, setMenuItems] = useState([]);
    const [orderedItems, setOrderedItems] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);
    function existingItem(item){
        for(let i of orderedItems){
            if(item.name === i.name){
                return true;
            }
        }
        return false;
    }
    function addToOrder(item){

        if(existingItem(item)){
            setOrderedItems(
                orderedItems.map((orderedItem) => {
                    if (orderedItem.id === item.id) {
                        return { ...orderedItem, quantity: orderedItem.quantity + 1 };
                    }
                    return orderedItem; // Keep other items unchanged
                })
            );
        }   
        else {
            setOrderedItems([...orderedItems, { ...item, quantity: 1 }]);

        }
        setOrderTotal(orderTotal + item.price);        
    }

    function updateQuantity(itemName, isIncrement) {
        console.log(itemName)
        setOrderedItems((prevItems) => {
            return prevItems
                .map((orderedItem) => {
                    if (orderedItem.name === itemName) {
                        if (isIncrement) {
                            // Increment the quantity
                            setOrderTotal(orderTotal + orderedItem.price);        

                            return { ...orderedItem, quantity: orderedItem.quantity + 1 };

                        } else {
                            // Decrement the quantity but only if it's greater than 1
                            setOrderTotal(orderTotal - orderedItem.price);     
                            if (orderedItem.quantity > 1) {
                                return { ...orderedItem, quantity: orderedItem.quantity - 1 };
                            } else {
                                // Return null for items that should be removed
                                return null;
                            }
                        }
                    }
                    return orderedItem; // Return other items unchanged
                })
                .filter((orderedItem) => orderedItem !== null); // Remove null items
        });
    }
    useEffect(() => {
        // Define the three requests
        const fetchMenuItems = axios.get('http://localhost:3000/menu');
    
        // Use Promise.all to run requests concurrently
        Promise.all([fetchMenuItems])
            .then(([MenuItemsRes]) => {
                setMenuItems(MenuItemsRes.data);
            })
            .catch(err => {
                console.error('Error fetching');
            });
    }, []);
    return(
        <div className='newOrder-container' style={{display:"flex"}}>
        <form style={{display:"flex"}} action="http://localhost:3000/orders" method='post'>
            <div className="newOrder-form" >
                <h1>New order</h1>
                    <div class="mb-3">
                        <label for="customer_name" class="form-label">Customer Name</label>
                        <input type="text" name="customer_name" placeholder="Enter customer name" id="customer_name" class="form-control" required/>
                        <div class="invalid-feedback">Please enter the customer's Name</div>
                        
                    </div>

                    <div class="mb-3">
                        <label for="employee_id" class="form-label">Employee id</label>
                        <input type="text" name='employee_id' placeholder='Employee id' class="form-control" required/>
                        <div class="invalid-feedback">Please enter the Employee id </div>
                        
                    </div>
                   
                    <div class="mb-3">
                        <label for="table_number" class="form-label">table no.</label>
                        <input name="table_number" id="table_number" placeholder="enter table number here" class="form-control"required/>
                        <div class="invalid-feedback">Please enter the table number</div>
                    </div>

                
                    <h3>Menu Items</h3>

                    <div className='menuItems'>
                    {menuItems.map((item) =>(
                    <div className="card">
                    <img src={item.img} className="menuItem-img card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title"> {item.name}</h5>
                        <p className="card-text">{item.description}</p>
                        <button type='button' onClick={()=>addToOrder(item)} className="btn menuItem-btn add-btn">add</button>
                    </div>
                </div>
                    ))}
                    </div>

               
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>

            </div>
            <div className='order-details'>
                <div>
                    <h2>Order details</h2>
                    <table class="table ">
                        <thead>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>price</th>
                            <th>total cost</th>
                        </thead>
                        <tbody>
                        {orderedItems.map((orderedItem)=>(
                            <tr>
                                <td> {orderedItem.name} </td>
                                <td>
                                    <div>
                                        <button className='btn' type='button' onClick={()=>updateQuantity(orderedItem.name, false)}>-</button>
                                        {orderedItem.quantity}
                                        <button className='btn' type='button' onClick={()=>updateQuantity(orderedItem.name, true)}>+</button>
                                    </div>
                                </td>  
                                <td>{orderedItem.price}</td>
                                <td>{(orderedItem.quantity * orderedItem.price).toFixed(2)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="summary-container">
                    <div className="summary orderSubTotal">
                        <div>
                            Order subtotal
                        </div>
                        <div>
                            {orderTotal.toFixed(2)}
                        </div>
                    </div>
                    <div className="summary orderTaxes">
                        <div>
                            HST 
                        </div>
                        <div>
                            {(orderTotal *0.15).toFixed(2)}
                        </div>
                    </div>
                    <div className="bold summary orderTotal">
                        <div>
                            Order total
                        </div>
                        <div>
                            {(orderTotal* 1.15).toFixed(2)}
                        </div>
                    </div>
                   
                    <button action= "/"className='submitOrder-btn btn' type='submit'>Place Order</button>
                </div>                               
            </div>
            <input type="hidden" name="total_amount" value={orderTotal.toFixed(2)} />
            <input type="hidden" name="date" value={new Date().toISOString()} />
            <input type="hidden" name="items" value={JSON.stringify(orderedItems)} />


        </form>
        </div> 
       
    )
}

export default EditOrder;