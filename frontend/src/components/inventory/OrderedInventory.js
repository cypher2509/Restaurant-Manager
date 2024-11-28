import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderedInventory(){
    const[OrderedInventory, setOrderedInventory] = useState([]);
    const[error, setError] = useState('');
    const[loading, setLoading] = false;

    useEffect(()=>{
        document.body.style.backgroundColor = '#f9f9f9';
        const fetchOrderedInventory = async () =>{
            try{
                const response = await axios.get('http://localhost:3000/inventory/ordered');
                setOrderedInventory(response.data)
                if (response.data.length == 0){
                    setError('No ')
                }
            }
            catch(err){
                console.log(err.data.message);
            }
        } 
    })
}