import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function NewEmployee() {

    const navigate = useNavigate();
    const [employeeDetails, setEmployeeDetails] = useState({
        first_name: "",
        last_name: "",
        role: "",
        hourly_wage: 0,
        email: ""
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/employees', employeeDetails);

            if (response.data) {
                setSuccess('employee created successfully.');
                setError('');
                setEmployeeDetails({
                    first_name: "",
                    last_name: "",
                    role: "",
                    hourly_wage: 0,
                    email: ""
                });
            alert(`employee created successfuly`);
            navigate('/StaffManagement')
            }
        } catch (err) {
            setError('Failed to create the employee. Please try again.');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="col-6 offset-3 employee-form-container">
            <form onSubmit={handleSubmit}>
                <h1>Create new employee</h1>

                {error && <p className="text-danger">{error}</p>}

                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">first name:</label>
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-control"
                        value={employeeDetails.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">last name:</label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-control"
                        value={employeeDetails.last_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="role" className="form-label">role</label>
                    <input
                        type="text"
                        name="role"
                        id="role"
                        className="form-control"
                        value={employeeDetails.role}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="hourly_wage" className="form-label">hourly wage</label>
                    <input
                        type="number"
                        name="hourly_wage"
                        id="hourly_wage"
                        className="form-control"
                        value={employeeDetails.hourly_wage}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control"
                        value={employeeDetails.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Create employee</button>
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

export default NewEmployee;
