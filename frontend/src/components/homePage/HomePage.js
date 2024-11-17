import React from "react";
import Tables from "../tables/Tables.js"
import "./homePage.css"
import Order from "../orders/Order.js";
import Reservation from "../reservation/Reservation.js";
import Staff from "../staff/Staff.js";
import Menu from "../menu/Menu.js";
import Inventory from "../inventory/Inventory.js";

function HomePage(){
    return(
        <div className="home">
            <Tables/>
            <Order/>
            <Reservation/>
            <Staff/>
            <Menu/>
            <Inventory/>
        </div>
        
    )
}

export default HomePage;