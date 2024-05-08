import React, { useState, useEffect } from 'react';
import { fetchDepartments, deleteDepartment, updateDepartment, createDepartment } from '../api'; // Import all necessary functions from api.js
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Department() {
    const [departments, setDepartments] = useState([]);
    const [, setError] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [showInputForDepartment, setShowInputForDepartment] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // State to track if update mode is active
    const [showModal, setShowModal] = useState(false);

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
            const departmentToDelete = departments.find(d => d.id === departmentId);

            if (!departmentToDelete) {
                throw new Error('Department not found');
            }

            const result = await Swal.fire({
                title: 'Delete Department',
                text: `Are you sure you want to delete "${departmentToDelete.name}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545', // Bootstrap danger color
            });

            if (result.isConfirmed) {
                await deleteDepartment(departmentId);
                setDepartments(departments.filter(d => d.id !== departmentId));

                Swal.fire({
                    icon: 'success',
                    title: 'Department Deleted',
                    text: `Department "${departmentToDelete.name}" has been deleted successfully.`,
                });
            }
        } catch (error) {
            console.error('Error deleting department:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete department. Please try again.',
            });
        }
    };

    const handleUpdate = async (departmentId) => {
        try {
            // Perform update operation
            await updateDepartment(departmentId, { name: newDepartmentName });

            // Fetch updated departments
            const updatedDepartments = await fetchDepartments();
            setDepartments(updatedDepartments);

            // Reset state after successful update
            setIsUpdating(false);
            setShowInputForDepartment(null);

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Department Updated',
                text: `Department updated successfully.`,
            });
        } catch (error) {
            console.error('Error updating department:', error);

            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update department. Please try again.',
            });
        }
    };

    const handleCancel = () => {
        setIsUpdating(false);
        setShowInputForDepartment(null);
        setNewDepartmentName('');
        setShowModal(false); // Close the modal when "Cancel" is clicked
    };

    const handleCreateDepartment = async () => {
        try {
            await createDepartment({ name: newDepartmentName });
            const updatedDepartments = await fetchDepartments();
            setDepartments(updatedDepartments);
            setShowModal(false);
            setNewDepartmentName('');

            // Show success alert
            Swal.fire({
                title: 'Create Department',
                text: 'Department created successfully.',
                icon: 'success',
            });
        } catch (error) {
            console.error('Error creating department:', error);
            setError('Failed to create department. Please try again.');

            // Show error alert
            Swal.fire({
                title: 'Create Department',
                text: 'Failed to create department. Please try again.',
                icon: 'error',
            });
        }
    };


    return (
        <div>
            <br></br><br></br>
            <h2>Departments</h2>
            <Button variant="primary" className="m-2 float-end" onClick={() => setShowModal(true)}>
                Add Department
            </Button>
            <br/><br/>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Department Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.id}>
                                <td>{department.id}</td>
                                <td>
                                    {isUpdating && showInputForDepartment === department.id ? (
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                value={newDepartmentName}
                                                onChange={(e) => setNewDepartmentName(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdate(department.id);
                                                    }
                                                }}
                                                className="form-control"
                                                placeholder="Enter new department name"
                                            />
                                        </div>
                                    ) : (
                                        <span>{department.name}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDepartment === department.id ? (
                                        <div>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleUpdate(department.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                className="btn btn-danger me-2"
                                                onClick={() => handleDelete(department.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => {
                                                    setShowInputForDepartment(department.id);
                                                    setIsUpdating(true);
                                                    setNewDepartmentName(department.name);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={()=>{
                                                    window.location.href = "/departments/details";
                                                }}
                                            >
                                                Details
                                                
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateDepartment(); }}>
                        <div className="form-group">
                            <label htmlFor="departmentName">Name:</label>
                            <input
                                type="text"
                                id="departmentName"
                                className="form-control"
                                value={newDepartmentName}
                                onChange={(e) => setNewDepartmentName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Create Department
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Department;
