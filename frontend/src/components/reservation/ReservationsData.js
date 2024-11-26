import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReservationsData() {
    const [reservations, setReservations] = useState([]);
    const [status, setStatus] = useState('confirmed'); // Default status filter
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, [status]); // Re-fetch data when status changes

    const fetchReservations = async () => {
        try {
            setLoading(true); // Show loading state
            const response = await axios.get(`http://localhost:3000/reservations?status=${status}`);
            setReservations(response.data.reservations || []);
            setError('');
        } catch (err) {
            setError('Failed to fetch reservations. Please try again later.');
            setReservations([]);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Reservations</h1>
            
            <div className="d-flex justify-content-between align-items-center my-3">
                <label htmlFor="status" className="form-label">Filter by Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-select w-25"
                >
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {loading ? (
                <p>Loading reservations...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : reservations.length === 0 ? (
                <p>No reservations found for today with the status "{status}".</p>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Table</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Party Size</th>
                            <th>Status</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation, index) => (
                            <tr key={reservation.id}>
                                <td>{index + 1}</td>
                                <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
                                <td>{reservation.table_id}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.time}</td>
                                <td>{reservation.party_size}</td>
                                <td>{reservation.status}</td>
                                <td>{reservation.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ReservationsData;
