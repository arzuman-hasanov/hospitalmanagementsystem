import React, { useState, useEffect } from 'react';
import { fetchDoctors } from '../api';

function Doctor() {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsData = await fetchDoctors();
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching doctors data:', error);
                setError(error.message);
            }
        };

        fetchData(); // Fetch doctors data when component mounts
    }, []);

    const getDepartmentNameByDoctor = (doctor) => {
        // Extract department name from the doctor object
        return doctor.department ? doctor.department : 'Unknown';
    };

    return (
        <div>
            {error && <p>Error: {error}</p>}
            <h2>Doctors Information</h2>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>
                        <strong>Doctor :</strong> {doctor.name}
                        <strong> </strong> {doctor.surname}<br />
                        <strong>Department:</strong> {getDepartmentNameByDoctor(doctor)}<br/> <br/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Doctor;
