import React, {useState, useEffect} from 'react';
import axios from "axios";

import './reports.css';

function Reports(){
    return(
        <div className="reports-container">
            <img className='report-img img' src="reports.jpg" alt="" />
            <div className="text report-text">
                reports <a href="/reports"><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
            </div>
        </div>
    )
}

export default Reports;