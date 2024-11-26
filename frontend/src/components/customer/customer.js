import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';

function CustomerAuthentication() {
    const {checkFor} = useParams();
    const [contact, setContact] = useState(''); // State for contact input
    const [customer, setCustomer] = useState(null); // State for customer details
    const [error, setError] = useState(''); // State for error messages
    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        email: ''
    }); // State for new customer form
    const navigate = useNavigate(); // Hook for navigation

    const handleCheckCustomer = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Fetch customer data from the server
            const response = await axios.get(`http://localhost:3000/customers/check?contactNumber=${contact}`);

            if (response.data && response.data.customer) {
                setCustomer(response.data.customer); // Set customer data
                setError(''); // Clear error if data is found
                // Redirect to homepage
                navigate(`/${checkFor}/new/${response.data.customer.id}`);
            } else {
                setCustomer(null); // Clear customer data
                setError('Customer does not exist. Please create a new customer.');
            }
        } catch (err) {
            // Handle errors
            setError('An error occurred while fetching the customer data.');
            setCustomer(null);
            console.error(err);
        }
    };

    const handleCreateCustomer = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Create new customer
            const response = await axios.post('http://localhost:3000/customers', {
                firstName: newCustomer.firstName,
                lastName: newCustomer.lastName,
                contactNumber: contact,
                email: newCustomer.email
            });

            if (response.data && response.data.customerId) {
                setError(''); // Clear error
                // Redirect to homepage
                navigate(`/${checkFor}/new/${response.data.customer.id}`);
            } else {
                setError('Failed to create customer.');
            }
        } catch (err) {
            // Handle errors
            setError('An error occurred while creating the customer.');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="customer-container " > 
            <form
                onSubmit={handleCheckCustomer}
            >
                <div className="newOrder-form col-6 offset-3" style={{height:80+'%'}}>
                    <h1>find existing customer</h1>
                    <div className="mb-3">
                        <label htmlFor="customer_contact" className="form-label">
                            Customer Contact
                        </label>
                        <input
                            type="text"
                            name="contactNumber"
                            placeholder="Enter customer contact number"
                            id="customer_contact"
                            className="form-control"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                        />
                        <div className="invalid-feedback">
                            Please enter the customer's contact number
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Check Customer
                    </button>
                </div>
            </form>

            {error && <p className='col-6 offset-3' style={{ color: "red" }}>{error}</p>}

            {!customer && error && (
                <form
                    onSubmit={handleCreateCustomer}
                >
                    <div className="newOrder-form col-6 offset-3">
                        <h1>Create New Customer</h1>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                id="first_name"
                                className="form-control"
                                value={newCustomer.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter the first name
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                id="last_name"
                                className="form-control"
                                value={newCustomer.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter the last name
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                id="email"
                                className="form-control"
                                value={newCustomer.email}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Please enter a valid email
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">
                            Create Customer
                        </button>
                    </div>
                </form>
            )}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>

        </div>
    );
}

export default CustomerAuthentication;
