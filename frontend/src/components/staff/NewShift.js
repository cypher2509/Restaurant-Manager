import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewShift() {
    const navigate = useNavigate();
    const [shiftDetails, setShiftDetails] = useState({
        employee_id: 0,
        start_time: "00:00:00",
        end_time: "00:00:00",
        shift_date: "2024-01-01"
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShiftDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/shifts', shiftDetails);

            if (response.data) {
                setSuccess('shift created successfully.');
                setError('');
                setShiftDetails({
                    employee_id: 0,
                    start_time: "00:00:00",
                    end_time: "00:00:00",
                    shift_date: "2024-01-01"
                });
                alert('shift created successfully');
                navigate('/StaffManagement');
            }
        } catch (err) {
            setError('Failed to create the shift. Please try again.');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 shift-form-container">
            <form onSubmit={handleSubmit}>
                <h1>Create new shift</h1>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="mb-3">
                    <label htmlFor="employee_id" className="form-label">employee id:</label>
                    <input
                        type="number"
                        name="employee_id"
                        id="employee_id"
                        className="form-control"
                        value={shiftDetails.employee_id}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="start_time" className="form-label">start time:</label>
                    <input
                        type="time"
                        name="start_time"
                        id="start_time"
                        className="form-control"
                        value={shiftDetails.start_time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="end_time" className="form-label">end time</label>
                    <input
                        type="time"
                        name="end_time"
                        id="end_time"
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
                        id="shift_date"
                        className="form-control"
                        value={shiftDetails.shift_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <button type="submit" className="btn btn-primary w-100">Create shift</button>
            </form>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
        </div>
    );
}

export default NewShift;
