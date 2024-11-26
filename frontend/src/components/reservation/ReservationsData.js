import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ReservationsData() {
    const {status} = useParams();
    console.log(status)
    const [reservations, setReservations] = useState([]);
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
            <h1 className="text-center">{status} reservations</h1>
            

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
                                <td>{reservation.location}</td>
                                <td><a href={`/reservation/edit/${reservation.id}`}>edit</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
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

export default ReservationsData;
