import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { fetchDepartments } from '../api';

function Departmentdetails() {
    // const { departmentId } = useParams(); // Get departmentId from URL params
    const [departments, setDepartments] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <div>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments && departments.map((department) => (
                            <tr key={department.id}>
                                <td>{department.id}</td>
                                <td>{department.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Departmentdetails;
