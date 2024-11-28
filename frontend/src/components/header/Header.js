import React from "react";

import "./Header.css";

function Header(){
    let date = new Date().toISOString().split('T')[0]

    return(
        <div className="App">
            <div className="Header">
                <div className="logo">
                PUL's Bar and Grill <br/>
                <p>Try not to lick your fingers</p>
                </div>
                <div className="header-left">
                <div className="date">Date<br/><p>{date}</p></div>
                <div className="user">
                <i class="fa-solid fa-user"></i>
                    <div> 
                    Gordon Ramsay <br/>
                    <p>User</p>
                    </div>
                </div>
                </div>
                
            </div>

            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Koulen&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            
        </div> 
    )
}

export default Header;

