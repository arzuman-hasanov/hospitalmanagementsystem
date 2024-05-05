import React, { useState, useEffect } from 'react';
import { fetchDepartments, deleteDepartment, updateDepartment } from './api'; // Import fetchDepartments, deleteDepartment, and updateDepartment functions from api.js
import DepartmentForm from './Departmentform';
import './Departmentspage.css';

function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState(''); 
    const [showInputForDepartment, setShowInputForDepartment] = useState(null); 
    const [isUpdating, setIsUpdating] = useState(false); // State to track if update mode is active

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDepartments();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setError(error.message); 
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (departmentId) => {
        try {
            await deleteDepartment(departmentId);
            setDepartments(departments.filter(department => department.id !== departmentId));
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    const handleUpdate = async (departmentId) => {
        try {
            await updateDepartment(departmentId, { name: newDepartmentName });
            const updatedDepartments = await fetchDepartments();
            setDepartments(updatedDepartments);
            setIsUpdating(false); // Exit update mode
            setShowInputForDepartment(null);
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    const handleCancel = () => {
        setIsUpdating(false); // Exit update mode
        setShowInputForDepartment(null);
        setNewDepartmentName(''); // Clear new department name
    };

    return (
        <div>
            <h1>Departments</h1>
            {error && <p>Error: {error}</p>}
            <ul>
                {departments.map((department) => (
                    <li key={department.id}>
                        {isUpdating && showInputForDepartment === department.id ? (
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
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {department.name}
                                <button onClick={() => handleDelete(department.id)}>Delete</button>
                                <button onClick={() => {
                                    setShowInputForDepartment(department.id);
                                    setIsUpdating(true); // Enter update mode
                                    setNewDepartmentName(department.name); // Populate input with current name
                                }}>Update</button>
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
