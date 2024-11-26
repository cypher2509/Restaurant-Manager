import React, { useState } from 'react';
import axios from 'axios';

import './reservationForm.css';

function ReservationForm() {
    const [reservationDetails, setReservationDetails] = useState({
        customerId: '',
        tableId: '',
        date: '',
        time: '',
        partySize: '',
        status: 'confirmed'
    });
    const [availableTables, setAvailableTables] = useState([])
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReservationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckAvailibilty = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Convert reservationDetails to query parameters
            const { date, time, partySize } = reservationDetails;
            const queryParams = new URLSearchParams({
                date,
                time,
                partySize
            }).toString();
    
            const response = await axios.get(`http://localhost:3000/tables/available?${queryParams}`);
    
            if (response.data) {
                console.log(response.data);
                setAvailableTables(response.data); // Update available tables state
                setError('');
                setSuccess('Available tables fetched successfully.');
            }
        } catch (err) {
            setError('An error occurred while fetching available tables.');
            setSuccess('');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.post('http://localhost:3000/reservations', reservationDetails);

            if (response.data && response.data.reservationId) {
                setError('');
                setSuccess(`Reservation created successfully. ID: ${response.data.reservationId}`);
                setReservationDetails({
                    customerId: '',
                    tableId: '',
                    date: '',
                    time: '',
                    partySize: '',
                    status: 'confirmed'
                });
            }
        } catch (err) {
            setError('An error occurred while creating the reservation.');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 reservationForm-container" >
            <form
                onSubmit={handleCheckAvailibilty}
            >
                <h1>make a reservation</h1>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        className="form-control"
                        value={reservationDetails.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="time" className="form-label">Time</label>
                    <input
                        type="time"
                        name="time"
                        id="time"
                        className="form-control"
                        value={reservationDetails.time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="partySize" className="form-label">Party Size</label>
                    <input
                        type="number"
                        name="partySize"
                        id="partySize"
                        className="form-control"
                        value={reservationDetails.partySize}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn check-btn w-100 m-4">check table availibilty</button>
            </form>

        
            {availableTables.length>0 ? (<div><h3>available tables:</h3>
            <div className="availableTables">
                {availableTables.map((table)=>(
                   <div class="card" style={{width: 18+"rem"}}>
                   <div class="card-body">
                     <h4 class="card-title">table {table.table_id}</h4>
                     <p class="card-text">capacity: {table.capacity}</p>
                     <p class="card-text">location: {table.location}</p>
                     <button class="btn card-link">Book Table</button>
                   </div>
                 </div>
                ))}
            </div>
            </div>
            ):(
                <p>No available tables.</p>
            )}

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
        </div>
    );
}

export default ReservationForm;
