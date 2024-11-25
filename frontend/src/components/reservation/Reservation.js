import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./reservation.css";

function Reservation(){
    const[scheduled_reservations, setScheduled_reservations] = useState([]);
    const[completed_reservations, setCompleted_reservations] = useState([]);
    const[ongoing_reservations, setongoing_reservations] = useState([]);
    
    const [scheduled_reservations_count, setScheduled_reservations_count] = useState(0);
    const [completed_reservations_count, setCompleted_reservations_count] = useState(0);
    const [ongoing_reservations_count, setongoing_reservations_count] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchScheduled = axios.get('http://localhost:3000/reservations/scheduled');
        const fetchCompleted = axios.get('http://localhost:3000/reservations/completed');
        const fetchOngoing = axios.get('http://localhost:3000/reservations/ongoing');

        Promise.all([fetchScheduled, fetchCompleted, fetchOngoing])
        .then(([scheduledRes, completedRes, ongoingRes]) => {
            setScheduled_reservations(scheduledRes.data);
            setCompleted_reservations(completedRes.data);
            setongoing_reservations(ongoingRes.data);
            setScheduled_reservations_count(scheduledRes.data.length);
            setCompleted_reservations_count(completedRes.data.length);
            setongoing_reservations_count(ongoingRes.data.length);
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
            <div className="reservation-btn-container">
                <form className='btn-reservation btn-add-res'action="" method="get">
                        <button className='btn'><i class="fa-regular fa-plus"></i></button>
                </form>
                <form className='btn-reservation btn-edit' action="" method="get">
                    <button className='btn'><i class="fa-solid fa-pen-to-square" style={{color: '#ffffff'}}></i></button>
                </form>
                <form className='btn-reservation btn-enter' action="" method="get">
                    <button className='btn'><img src="door.png" alt="" /></button>
                </form>
            </div>
               


            <div className="reservations scheduled-reservations">    
                <div className="scheduled-reservations-heading reservations-heading">
                    <p>scheduled <br/> reservations</p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
                <div>
                    <p className='count'>{scheduled_reservations_count}</p>
                </div>
            </div>

            <div className="reservations completed-reservations">
                <div className="completed-reservations-heading reservations-heading">
                    <p>completed<br/> reservations</p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
                <div>
                    <p className='count'>{completed_reservations_count}</p>
                </div>
            </div>

            <div className="reservations ongoing-reservations">
                <div className="ongoing-reservations-heading reservations-heading">
                    <p>ongoing reservations <span className='count'>{ongoing_reservations_count}</span></p>
                    <a href=""><i class="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 +"deg"}}></i></a>
                </div>
            </div>
        </div>
    )
}

export default Reservation;