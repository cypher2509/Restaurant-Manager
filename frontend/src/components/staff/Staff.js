import React, {useState, useEffect} from 'react';
import axios from "axios";

import './staff.css';

function Staff(){
    return(
        <div className="staff-container">
            < img className='staff-img img' src="staff.jpg" alt="" />
            <div className="text staff-text">
                Staff Management <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
            </div>
            
        </div>
        
    )
}

export default Staff;