import React, { useState, useEffect } from 'react';
import axios from "axios";

import "./reservation.css";

function Reservation(){

    const [scheduled_reservations_count, setScheduled_reservations_count] = useState(0);
    const [completed_reservations_count, setCompleted_reservations_count] = useState(0);
    const [ongoing_reservations_count, setongoing_reservations_count] = useState(0);
    const [error, setError] = useState(null);

    // Run useEffect only once when the component mounts
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const fetchScheduled = axios.get('http://localhost:3000/reservations?status=confirmed');
                const fetchCompleted = axios.get('http://localhost:3000/reservations?status=completed');
                const fetchOngoing = axios.get('http://localhost:3000/reservations?status=ongoing');

                const [scheduledRes, completedRes, ongoingRes] = await Promise.all([
                    fetchScheduled,
                    fetchCompleted,
                    fetchOngoing
                ]);

                console.log('scheduled res: ',scheduledRes.data.reservations.length);

                setScheduled_reservations_count(scheduledRes.data.reservations.length);
                setCompleted_reservations_count(completedRes.data.reservations.length);
                setongoing_reservations_count(ongoingRes.data.reservations.length);

            } catch (err) {
                console.error('Error fetching reservations:', err);

            }
        };

        fetchReservations();
    }, []);

    return (
        <div className="reservation-container">
            <div className="reservation-btn-container">
                <form className="btn-reservation btn-add-res" action="/customerCheck/reservation" method="get">
                    <button className="btn"><i className="fa-regular fa-plus"></i></button>
                </form>
                <form className="btn-reservation btn-edit" action="/ReservationsData/confirmed" method="get">
                    <button className="btn"><i className="fa-solid fa-pen-to-square" style={{color: '#ffffff'}}></i></button>
                </form>
                <form className="btn-reservation btn-enter" action="" method="get">
                    <button className="btn"><img src="door.png" alt="" /></button>
                </form>
            </div>

            <div className="reservations scheduled-reservations">    
                <div className="scheduled-reservations-heading reservations-heading">
                    <p>Scheduled <br /> Reservations</p>
                    <a href="/reservations/data/confirmed"><i className="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 + "deg"}}></i></a>
                </div>
                <div>
                    <p className="count">{scheduled_reservations_count}</p>
                </div>
            </div>

            <div className="reservations completed-reservations">
                <div className="completed-reservations-heading reservations-heading">
                    <p>Completed<br /> Reservations</p>
                    <a href="/reservations/data/completed"><i className="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 + "deg"}}></i></a>
                </div>
                <div>
                    <p className="count">{completed_reservations_count}</p>
                </div>
            </div>

            <div className="reservations ongoing-reservations">
                <div className="ongoing-reservations-heading reservations-heading">
                    <p>Ongoing Reservations <span className="count">{ongoing_reservations_count}</span></p>
                    <a href="/reservations/data/ongoing"><i className="fa-solid fa-arrow-right fa-rotate-by" style={{rotate: -45 + "deg"}}></i></a>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
