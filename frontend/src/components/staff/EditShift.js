import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditShift() {
    const { id } = useParams(); // Get the shift ID from URL
    const navigate = useNavigate(); // Hook for navigation

    const [shiftDetails, setShiftDetails] = useState({
        employee_id: 0,
        start_start_time: "00:00:00",
        end_start_time: "00:00:00",
        shift_employee_id: "2024-01-01"
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShiftDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

        // Fetch existing shift details

    const fetchShift = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/shifts/${id}`);
            if (response.data) {
                setShiftDetails(response.data);
            }
        } catch (err) {
            setError('Failed to fetch shift details.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchShift();
    }, []);


    const handleUpdateShift = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:3000/shifts/${id}`, shiftDetails);

            if (response.status === 200) {
                setError('');
                alert('shift updated successfully.');
                navigate('/StaffManagement'); // Redirect to homepage after successful upemployee_id
            }
        } catch (err) {
            setError('An error occurred while updating the shift.');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 shiftForm-container">
            <form>
                <h1>edit shift</h1>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="employee_id" className="form-label">employee id</label>
                    <input
                        type="number"
                        name="employee_id"
                        Id="employee_id"
                        className="form-control"
                        placeholder= {shiftDetails.employee_id}
                        value={shiftDetails.employee_id}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="start_time" className="form-label">start</label>
                    <input
                        type="time"
                        name="start_time"
                        Id="start_time"
                        className="form-control"
                        value={shiftDetails.start_time}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="end_time" className="form-label">end</label>
                    <input
                        type="time"
                        name="end_time"
                        Id="end_time"
                        className="form-control"
                        value={shiftDetails.end_time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="shift_date" className="form-label">date</label>
                    <input
                        type="date"
                        name="shift_date"
                        Id="shift_date"
                        className="form-control"
                        placeholder={shiftDetails.shift_date}
                        value={shiftDetails.shift_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </form>

            <button
                onClick={handleUpdateShift}
                className="btn btn-success w-100 mt-4">
                Update shift
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

export default EditShift;
