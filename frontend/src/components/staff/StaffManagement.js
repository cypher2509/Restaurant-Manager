import React, {useState, useEffect} from 'react';
import axios from "axios";
import './StaffManagement.css'

function StaffManagement(){

    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [error, setError] = useState('');

    async function fetchEmployees() {
        try{
            const response = await axios.get('http://localhost:3000/employees')
            setEmployees(response.data);
        }
        catch(err){
            setError('Failed to get the employees.')
            console.log(err.message);
        }
    } 
    async function fetchShifts() {
        try{
            const response = await axios.get('http://localhost:3000/shifts')
            setShifts(response.data);
        }
        catch(err){
            setError('Failed to get the shifts.')
            console.log(err.message);
        }
    } 

    useEffect(()=>{
        fetchEmployees();
        fetchShifts();
    },[])

    

    return(

        <div className="staff-management-container col-6 offset-3 mt-2">
            <h1>employees</h1>
            <br />
            <table className='staff-management-table table table-striped'>
                <thead>
                    <th>id</th>
                    <th>name</th>
                    <th>role</th>
                    <th>wage</th>
                    <th>email</th>
                </thead>
                <tbody>
                    {employees.map((employee)=>(
                        <tr>
                            <td>{employee.id}</td>
                            <td>{employee.first_name + employee.last_name}</td>
                            <td>{employee.role}</td>
                            <td>{employee.hourly_wage}</td>
                            <td>{employee.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form action='/employees/new' style={{display:'flex', justifyContent:'end'}}>
                <button className='order-btn btn btn-primary'>add new employee</button>
            </form>

            <h1>shifts</h1>
            <table className='staff-management-table table table-striped'>
                <thead>
                    <th>id</th>
                    <th>emloyee id</th>
                    <th>start</th>
                    <th>end</th>
                    <th>date</th>
                    <th>status</th>
                </thead>
                <tbody>
                    {shifts.map((shift)=>(
                        <tr>
                            <td>{shift.id}</td>
                            <td>{shift.employee_id}</td>
                            <td>{shift.start_time}</td>
                            <td>{shift.end_time}</td>
                            <td>{shift.shift_date.split('T')[0]}</td>
                            <td>{shift.shift_status}</td>
                            <td><a href={`/shifts/edit/${shift.id}`}>edit</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form action='/shifts/new' style={{display:'flex', justifyContent:'end'}}> 
                <button className='order-btn btn btn-primary'>create new shift</button>
            </form>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
        </div>
        
    )
}

export default StaffManagement;