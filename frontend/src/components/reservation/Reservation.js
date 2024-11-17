import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./reservation.css";

function Reservation(){
    const[scheduled_reservations, setScheduled_reservations] = useState([]);
    const[completed_reservations, setCompleted_reservations] = useState([]);
    const[available_reservations, setAvailable_reservations] = useState([]);
    
    const [scheduled_reservations_count, setScheduled_reservations_count] = useState(0);
    const [completed_reservations_count, setCompleted_reservations_count] = useState(0);
    const [available_reservations_count, setAvailable_reservations_count] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchScheduled = axios.get('http://localhost:3000/reservations/scheduled');
        const fetchCompleted = axios.get('http://localhost:3000/reservations/completed');
        const fetchAvailable = axios.get('http://localhost:3000/reservations/available');

        Promise.all([fetchScheduled, fetchCompleted, fetchAvailable])
        .then(([scheduledRes, completedRes, availableRes]) => {
            setScheduled_reservations(scheduledRes.data);
            setCompleted_reservations(completedRes.data);
            setAvailable_reservations(availableRes.data);
            setScheduled_reservations_count(scheduledRes.data.length);
            setCompleted_reservations_count(completedRes.data.length);
            setAvailable_reservations_count(availableRes.data.length);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching');
            setError(err);
            setLoading(false);
        });

    })

    return(
        <div className="reservation-container">
                <form className='btn-reservation btn-add-res'action="" method="get">
                        <button className='btn'><i class="fa-regular fa-plus"></i></button>
                </form>
                <form className='btn-reservation btn-edit' action="" method="get">
                    <button className='btn'><i class="fa-solid fa-pen-to-square" style={{color: '#ffffff'}}></i></button>
                </form>
                <form className='btn-reservation btn-enter' action="" method="get">
                    <button className='btn'><img src="door.png" alt="" /></button>
                </form>


            <div className="reservations scheduled-reservations">    
                <div className="scheduled-reservations-heading reservations-heading">
                    <p>scheduled <br/> reservations</p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
                <div className="scheduled-reservations">
                    <p>{scheduled_reservations_count}</p>
                </div>
            </div>

            <div className="reservations completed-reservations">
                <div className="completed-reservations-heading reservations-heading">
                    <p>completed<br/> reservations</p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
                <div className="completed-reservations">
                    <p>{completed_reservations_count}</p>
                </div>
            </div>

            <div className="reservations available-reservations">
                <div className="available-reservations-heading reservations-heading">
                    <p>available reservations</p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
                <div className="available-reservations">
                    <p>{available_reservations_count}</p>
                </div>
            </div>
        </div>
    )
}

export default Reservation;