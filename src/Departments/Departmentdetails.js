import React, { useState, useEffect } from 'react';

const DepartmentDetails = ({ departmentId }) => {
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        const response = await fetch(`/api/departments/${departmentId}`);
        const data = await response.json();
        setDepartment(data);
      } catch (error) {
        console.error('Error fetching department details:', error);
      }
    };

    fetchDepartmentDetails();
  }, [departmentId]);

  return (
    <div>
      <h2>Department Details</h2>
      {department ? (
        <>
          <h3>{department.name}</h3>
          <p>Department ID: {department.id}</p>
          <h4>Doctors:</h4>
          <ul>
            {department.doctors.map((doctor) => (
              <li key={doctor.id}>
                <strong>{doctor.name} {doctor.surname}</strong>
                <p>Address: {doctor.address}</p>
                <p>Available: {doctor.isAvailable ? 'Yes' : 'No'}</p>
                <p>Department: {doctor.departmentId}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading department details...</p>
      )}
    </div>
  );
};

export default DepartmentDetails;
