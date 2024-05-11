// api.js
import Swal from 'sweetalert2';
import axios from 'axios';

const API_BASE_URL = 'https:/localhost:7281';

// Function to fetch all departments
const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Departments`);
        return response.data; // Return the department data
            
    } catch (error) {
        console.error('Error fetching departments:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch departments. Please try again later.',
        });
        throw error; // Throw the error to handle it in the calling code
    }
};

// Function to create a new department
const createDepartment = async (departmentData) => {
    try {
        const formData = new FormData();
        formData.append('name', departmentData.name);

        const response = await axios.post(`${API_BASE_URL}/Departments`, formData);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

// Function to update an existing department
const updateDepartment = async (departmentId, departmentData) => {
    try {
        const formData = new FormData();
        formData.append('name', departmentData.name); // Append the new department name to the FormData

        const response = await axios.put(`${API_BASE_URL}/Departments/${departmentId}`, formData);
        return response.data; // Return the updated department data
    } catch (error) {
        console.error('Error updating department:', error);
        throw error; // Throw the error to handle it in the calling code
    }
};

// Function to delete a department
const deleteDepartment = async (departmentId) => {
    try {
        await axios.delete(`${API_BASE_URL}/Departments/${departmentId}`);
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error; // Throw the error to handle it in the calling code
    }
};

// Function to fetch all doctors
const fetchDoctors = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Doctors`);
        return response.data; // Return the doctor data
    } catch (error) {
        console.error('Error fetching doctors:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch doctors. Please try again later.',
        });
        throw error; // Throw the error to handle it in the calling code
    }
};

// Function to create a new doctor
const createDoctor = async (doctorData) => {
    try {
        const formData = new FormData();
        formData.append('name', doctorData.name);
        formData.append('surname', doctorData.surname);
        formData.append('address', doctorData.address);
        formData.append('departmentId', doctorData.departmentId); // Ensure correct field name
        formData.append('isAvailable', doctorData.isAvailable);

        const response = await axios.post(`${API_BASE_URL}/Doctors`, formData);
        return response.data;
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error;
    }
};

const updateDoctor = async (doctorId, doctorData) => {
    try {
        const formData = new FormData();
        formData.append('name', doctorData.name);
        formData.append('surname', doctorData.surname);
        formData.append('address', doctorData.address);
        formData.append('departmentId', doctorData.departmentId);
        formData.append('isAvailable', doctorData.isAvailable);

        const response = await axios.put(`${API_BASE_URL}/Doctors/${doctorId}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating doctor:', error);
        throw error;
    }
};

// Function to delete a doctor
const deleteDoctor = async (doctorId) => {
    try {
        await axios.delete(`${API_BASE_URL}/Doctors/${doctorId}`);
    } catch (error) {
        console.error('Error deleting doctor:', error);
        throw error; // Throw the error to handle it in the calling code
    }
};

export async function createAppointment(doctorId, date) {

    const response = await fetch(`/api/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, date }),
    });

    if (!response.ok) {
        throw new Error('Failed to create appointment');
    }

    return response.json();
}

export { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchDoctors, createDoctor, updateDoctor, deleteDoctor };