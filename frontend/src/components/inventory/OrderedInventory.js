import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderedInventory(){
    const[orderedInventory, setOrderedInventory] = useState([]);
    const[error, setError] = useState('');
    const[page, setPage] = useState(1);
    const[loading, setLoading] = useState(true);

    useEffect(()=>{
        document.body.style.backgroundColor = '#f9f9f9';
        const fetchOrderedInventory = async () =>{
            try{
                const response = await axios.get(`http://localhost:3000/inventory/ordered/${page}`);
                setOrderedInventory(response.data)
                if (response.data.length == 0){
                    setError('No data found for the inventory orders.')
                }
            }
            catch(err){
                console.log(err.data.message);
            }
        } 
        fetchOrderedInventory();
    },[page])

        return(
            <div className="inventory-container col-8 offset-2">
                <h1>Inventory orders</h1>
                <div className="page-change" style={{display:'flex', justifyContent: 'end'}}>
                    <button onClick={()=>{ if(page != 1){setPage(page-1)}}} className='btn'> {`<`} </button>
                    page {page}
                    <button onClick={()=>{setPage(page+1)}} className='btn'>{`>`}</button>
                </div>
                <table className='inventory-table'>
                    <thead>
                        <th>id</th>
                        <th>item</th>
                        <th>order date</th>
                        <th>quantity</th>
                        <th>cost per unit</th>
                        <th>total</th>
                    </thead>
                    <tbody>
                        {orderedInventory.map((order)=>(
                            <tr key = {order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.inventory_item_name}</td>
                                <td>{(order.order_date).split('T')[0]}</td>
                                <td>{order.ordered_quantity}</td>
                                <td>$ {order.cost_per_unit}</td>
                                <td>$ {order.cost_per_unit*order.ordered_quantity }</td>
                            </tr>
                        ))}
                    </tbody>                   
                </table>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>

            </div>
        )
}

export default OrderedInventory;