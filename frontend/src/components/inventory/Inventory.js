import React, {useState, useEffect} from 'react';
import axios from "axios";

import './inventory.css';

function Inventory(){
    return(
        <div className="inventory-card-container">
            < img className='inventory-img img' src="inventory.jpg" alt="" />
            <div className="text inventory-text">
                Inventory Management <a href="/inventory/data"><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
            </div>
        </div>
    )
}

export default Inventory;