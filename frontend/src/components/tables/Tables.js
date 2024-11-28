import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./table.css";

function Tables(){
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get(`http://localhost:3000/tables`)
        .then(response => {
          setTables(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError(error);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return(
        <div className='table-map'>
            <h1>tables</h1>
            <div className="tables">
                {tables.map(table => (
                <img src="table.png"  key={table.id} style={{ opacity: table.isBooked ? '50%' : '100%' }}></img>
                ))}
            </div>
        </div>
    )
}

export default Tables;