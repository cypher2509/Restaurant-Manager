import React, {useState, useEffect} from 'react';
import axios from "axios";

import "./menuItem.css";

function MenuItem({ name, description, img }){
    return(
        <div className="card">
            <img src={img} className="menu-img card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title"> {name}</h5>
                <p className="card-text">{description}</p>
                <a href="#" className="btn btn-primary add-btn">add</a>
            </div>
        </div>
    )
}

export default MenuItem;