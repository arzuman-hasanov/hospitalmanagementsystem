import React, { useState, useEffect } from 'react';
import { fetchDepartments, deleteDepartment, updateDepartment } from './api'; // Import fetchDepartments, deleteDepartment, and updateDepartment functions from api.js
import DepartmentForm from './Departmentform';

function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState(''); // State to hold the new department name
    const [showInputForDepartment, setShowInputForDepartment] = useState(null); // State to track the department ID for which the input field is shown

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDepartments();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setError(error.message); // Set error state
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (departmentId) => {
        try {
            // Call deleteDepartment function to delete the department
            await deleteDepartment(departmentId);
            // Update departments state to remove the deleted department
            setDepartments(departments.filter(department => department.id !== departmentId));
        } catch (error) {
            console.error('Error deleting department:', error);
            // Handle error as needed
        }
    };

    const handleUpdate = async (departmentId) => {
        try {
            // Call updateDepartment function to update the department name
            await updateDepartment(departmentId, { name: newDepartmentName });
            // Fetch updated list of departments
            const updatedDepartments = await fetchDepartments();
            // Update departments state with the updated list
            setDepartments(updatedDepartments);
            // Hide the input field after updating
            setShowInputForDepartment(null);
        } catch (error) {
            console.error('Error updating department:', error);
            // Handle error as needed
        }
    };

    return (
        <div>
            <h1>Departments</h1>
            {error && <p>Error: {error}</p>} {/* Display error message if error state is set */}
            <ul>
                {departments.map((department) => (
                    <li key={department.id}>
                        {department.name}
                        <button onClick={() => handleDelete(department.id)}>Delete</button>
                        <button onClick={() => setShowInputForDepartment(department.id)}>Update</button>
                        {showInputForDepartment === department.id && (
                            <div>
                                <input 
                                    type="text" 
                                    value={newDepartmentName} 
                                    onChange={(e) => setNewDepartmentName(e.target.value)} 
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdate(department.id);
                                        }
                                    }}
                                    placeholder="Enter new department name" 
                                />
                                <button onClick={() => handleUpdate(department.id)}>Save</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <DepartmentForm />
        </div>
    );
}

export default DepartmentsPage;
