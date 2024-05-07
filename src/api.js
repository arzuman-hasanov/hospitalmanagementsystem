// api.js
import Swal from 'sweetalert2';
import axios from 'axios';

const API_BASE_URL = 'https:/localhost:7281'; // Base URL of your backend API

// Function to fetch all departments
const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Departments`);
        Swal.fire({
            icon: 'success',
            title: 'Departments Loaded',
            text: 'Departments data has been loaded successfully!',
        });
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

export { fetchDepartments, createDepartment, updateDepartment, deleteDepartment };
