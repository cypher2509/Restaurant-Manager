import React from "react";
import Tables from "../tables/Tables.js"
import "./homePage.css"
import Order from "../orders/Order.js";
import Reservation from "../reservation/Reservation.js";
import Reports from "../reports/Reports.js";
import Inventory from "../inventory/Inventory.js";
import Staff from "../staff/Staff.js";

function HomePage(){
    return(
        <div className="home">
            <Tables/>
            <Order/>
            <Reservation/>
            <Staff/>
            <Reports/>
            <Inventory/>

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        </div>
        
    )
}

export default HomePage;