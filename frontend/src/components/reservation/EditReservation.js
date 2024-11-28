import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import './reservationForm.css';

function EditReservation() {
    const { Id } = useParams(); // Get the reservation ID from URL
    const navigate = useNavigate(); // Hook for navigation

    const [reservationDetails, setReservationDetails] = useState({
        customerId: '',
        tableId: '',
        date: '',
        time: '',
        partySize: '',
        status: 'confirmed'
    });
    const [availableTables, setAvailableTables] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

        // Fetch existing reservation details
    useEffect(() => {
        // Fetch existing reservation details
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reservations/${Id}`);
                console.log(`http://localhost:3000/reservations/${Id}`)
                if (response.data.reservation) {
                    setReservationDetails(response.data.reservation);
                    console.log(reservationDetails);
                }
            } catch (err) {
                setError('Failed to fetch reservation details.');
                console.error(err);
            }
        };
        fetchReservation();
    }, [Id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReservationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckAvailibilty = async (e) => {
        e.preventDefault();

        try {
            const { date, time, partySize } = reservationDetails;
            const queryParams = new URLSearchParams({
                date,
                time,
                partySize
            }).toString();

            const response = await axios.get(`http://localhost:3000/tables/available?${queryParams}`);

            if (response.data) {
                setAvailableTables(response.data);
                setError('');
                setSuccess('Available tables fetched successfully.');
            }
        } catch (err) {
            setError('An error occurred while fetching available tables.');
            setSuccess('');
            console.error(err);
        }
    };

    const handleUpdateReservation = async () => {
        try {
            console.log(reservationDetails);
            const response = await axios.put(`http://localhost:3000/reservations/${Id}`, reservationDetails);

            if (response.status === 200) {
                setError('');
                alert('Reservation updated successfully.');
                navigate('/'); // Redirect to homepage after successful update
            }
        } catch (err) {
            setError('An error occurred while updating the reservation.');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 reservationForm-container">
            <form onSubmit={handleCheckAvailibilty}>
                <h1>Edit Reservation</h1>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        name="date"
                        Id="date"
                        className="form-control"
                        placeholder= {reservationDetails.date}
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
                        Id="time"
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
                        Id="partySize"
                        className="form-control"
                        placeholder={reservationDetails.partySize}
                        value={reservationDetails.partySize}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                        name="status"
                        Id="status"
                        className="form-select"
                        value={reservationDetails.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                    </select>
                </div>
                <button type="submit" className="btn check-btn w-100 m-4">Check Table Availability</button>
            </form>

            {availableTables.length > 0 ? (
                <div>
                    <h3>Available Tables:</h3>
                    <div className="availableTables">
                        {availableTables.map((table) => (
                            <div className="card" style={{ wIdth: '18rem' }} key={table.table_Id}>
                                <div className="card-body">
                                    <h4 className="card-title">Table {table.table_Id}</h4>
                                    <p className="card-text">Capacity: {table.capacity}</p>
                                    <p className="card-text">Location: {table.location}</p>
                                    <button
                                        onClick={() =>
                                            setReservationDetails((prev) => ({
                                                ...prev,
                                                tableId: table.table_Id
                                            }))
                                        }
                                        className="btn card-link"
                                    >
                                        Select Table
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No available tables.</p>
            )}

            <button
                onClick={handleUpdateReservation}
                className="btn btn-success w-100 mt-4"
            >
                Update Reservation
            </button>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
        </div>
    );
}

export default EditReservation;
