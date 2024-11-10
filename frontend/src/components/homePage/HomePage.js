import React from "react";
import Tables from "../tables/Tables.js"
import "./homePage.css"
import Order from "../orders/Order.js";

function HomePage(){
    return(
        <div className="home">
            <Tables/>
            <Order/>
        </div>
        
    )
}

export default HomePage;