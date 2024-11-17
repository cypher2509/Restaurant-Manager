import React, {useState, useEffect} from 'react';
import axios from "axios";

import './menu.css';

function Menu(){
    return(
        <div className="menu-container">
            < img className='menu-img img' src="menu.jpg" alt="" />
            <div className="menu-text">
                Menu <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
            </div>
        </div>
    )
}

export default Menu;