import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import { fetchData } from '../api';

const DepartmentDetails = () => {
  const { id } = useParams(); // Access the department id from the route params
  const [department, setDepartment] = useState(null);
  const API = "https:/localhost:7281/departments"

  useEffect(() => {
    // Fetch department details based on departmentId
    axios.get(`${API}/${id}`)
      .then(response => {
        setDepartment(response.data);
      })
      .catch(error => {
        console.error('Error fetching department details:', error);
      });
  }, [id]);

  if (!department) {
    return <div>Loading department details...</div>;
  }
  return (
    <div>
      <h3>{department.name}</h3>
      <h4>Doctors:</h4>
      {department.doctors && department.doctors.length > 0 ? (
        <ul>
          {department.doctors.map(doctor => (
            <li key={doctor.id}>
              {doctor.name} {doctor.surname} - {doctor.address}
            </li>
          ))}
        </ul>
      ) : (
        <h2>No doctors found for this department</h2>
      )}
    </div>
  );
};

export default DepartmentDetails;
