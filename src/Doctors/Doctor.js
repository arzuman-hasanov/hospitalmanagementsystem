import React, { useState, useEffect } from 'react';
import { fetchDoctors, deleteDoctor, updateDoctor, createDoctor, fetchDepartments } from '../api'; // Import generic API functions
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Doctor() {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [newDoctorName, setNewDoctorName] = useState('');
    const [newDoctorSurname, setNewDoctorSurname] = useState('');
    const [newDoctorDepartment, setNewDoctorDepartment] = useState('');
    const [newDoctorAddress, setNewDoctorAddress] = useState('');
    const [newDoctorIsAvailable, setNewDoctorIsAvailable] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); 
    const [showInputForDoctor, setShowInputForDoctor] = useState(null); 
    const [departments, setDepartments] = useState([]); // State for departments

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const doctorsData = await fetchDoctors();
                setDoctors(doctorsData);

                // Fetch departments and set them to state
                const departmentsData = await fetchDepartments(); // Assuming you have an API function named fetchDepartments
                setDepartments(departmentsData);
            } catch (error) {
                console.error('Error fetching Doctors:', error);
                setError(error.message);
            }
        };

        fetchDataFromAPI();
    }, []);

    const handleDelete = async (doctorId) => {
        try {
            const doctorToDelete = doctors.find(d => d.id === doctorId);

            if (!doctorToDelete) {
                throw new Error('Doctor not found');
            }

            const result = await Swal.fire({
                title: 'Delete Doctor',
                text: `Are you sure you want to delete ${doctorToDelete.name} ${doctorToDelete.surname}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545',
            });

            if (result.isConfirmed) {
                await deleteDoctor(doctorId);
                setDoctors(doctors.filter(d => d.id !== doctorId));

                Swal.fire({
                    icon: 'success',
                    title: 'Doctor Deleted',
                    text: `${doctorToDelete.name} ${doctorToDelete.surname} has been deleted successfully.`,
                });
            }
        } catch (error) {
            console.error('Error deleting Doctors:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete Doctors. Please try again.',
            });
        }
    };

    const handleUpdate = async (doctorId) => {
        try {
            // Extract numeric part from default department ID string
            const defaultDepartmentId = parseInt(newDoctorDepartment.match(/\d+/)[0]);
    
            await updateDoctor(doctorId, { 
                name: newDoctorName, 
                surname: newDoctorSurname, 
                address: newDoctorAddress,
                departmentId: defaultDepartmentId,
                isAvailable: newDoctorIsAvailable 
            });
    
            const updatedDoctors = doctors.map(doctor => {
                if (doctor.id === doctorId) {
                    return {
                        ...doctor,
                        name: newDoctorName !== '' ? newDoctorName : doctor.name,
                        surname: newDoctorSurname !== '' ? newDoctorSurname : doctor.surname,
                        address: newDoctorAddress !== '' ? newDoctorAddress : doctor.address,
                        departmentId: defaultDepartmentId !== '' ? defaultDepartmentId : doctor.departmentId,
                        isAvailable: newDoctorIsAvailable !== '' ? newDoctorIsAvailable : doctor.isAvailable
                    };
                }
                return doctor;
            });
    
            setDoctors(updatedDoctors);
            setIsUpdating(false);
            setShowInputForDoctor(null);
    
            Swal.fire({
                icon: 'success',
                title: 'Doctor Updated',
                text: 'Doctor updated successfully.',
            });
        } catch (error) {
            console.error('Error updating Doctors:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update Doctors. Please try again.',
            });
        }
    };
    

    const handleCancel = () => {
        setIsUpdating(false);
        setShowInputForDoctor(null);
        setNewDoctorName('');
        setNewDoctorSurname('');
        setNewDoctorDepartment('');
        setNewDoctorAddress('');
        setNewDoctorIsAvailable(false); 
        setShowModal(false);
    };

    const handleCreateDoctor = async () => {
        try {
            // Ensure the departmentId is a number (assuming it's expected as a number by the backend)
            const departmentId = parseInt(newDoctorDepartment);
    
            // Check if the departmentId is a valid number
            if (isNaN(departmentId)) {
                throw new Error('Please select a valid department');
            }
    
            await createDoctor({ 
                name: newDoctorName, 
                surname: newDoctorSurname, 
                address: newDoctorAddress,
                departmentId: departmentId, // Use departmentId instead of newDoctorDepartment
                isAvailable: newDoctorIsAvailable 
            });
    
            const updatedDoctors = await fetchDoctors();
            setDoctors(updatedDoctors);
            setShowModal(false);
            // Clear input fields after successful creation
            setNewDoctorName('');
            setNewDoctorSurname('');
            setNewDoctorDepartment('');
            setNewDoctorAddress('');
    
            Swal.fire({
                title: 'Create Doctor',
                text: 'Doctor created successfully.',
                icon: 'success',
            });
        } catch (error) {
            console.error('Error creating doctor:', error);
            setError(`Failed to create doctor. ${error.message}`);
    
            Swal.fire({
                title: 'Create Doctor',
                text: `Failed to create doctor. ${error.message}`,
                icon: 'error',
            });
        }
    };

    return (
        <div>
            {error && <p>Error: {error}</p>}
            <h2>Doctors Information</h2>
            <Button variant="primary" className="m-2 float-end" onClick={() => setShowModal(true)}>
                Add Doctor
            </Button>
            <br/><br/>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Doctor ID</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Department</th>
                            <th>Address</th>
                            <th>Available</th> 
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td>{doctor.id}</td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                value={newDoctorName}
                                                onChange={(e) => setNewDoctorName(e.target.value)}
                                                className="form-control"
                                                placeholder="Enter new name"
                                            />
                                        </div>
                                    ) : (
                                        <span>{doctor.name}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                value={newDoctorSurname}
                                                onChange={(e) => setNewDoctorSurname(e.target.value)}
                                                className="form-control"
                                                placeholder="Enter new surname"
                                            />
                                        </div>
                                    ) : (
                                        <span>{doctor.surname}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div className="input-group">
                                            <select
                                                value={newDoctorDepartment}
                                                onChange={(e) => setNewDoctorDepartment(e.target.value)}
                                                className="form-control"
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.id}>{department.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <span>{doctor.department ? doctor.department : 'Unknown'}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                value={newDoctorAddress}
                                                onChange={(e) => setNewDoctorAddress(e.target.value)}
                                                className="form-control"
                                                placeholder="Enter new address"
                                            />
                                        </div>
                                    ) : (
                                        <span>{doctor.address ? doctor.address : 'Unknown'}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div className="input-group">
                                            <select
                                                value={newDoctorIsAvailable}
                                                onChange={(e) => setNewDoctorIsAvailable(e.target.value)}
                                                className="form-control"
                                            >
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <span>{doctor.isAvailable ? 'Yes' : 'No'}</span>
                                    )}
                                </td>
                                <td>
                                    {isUpdating && showInputForDoctor === doctor.id ? (
                                        <div>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleUpdate(doctor.id)}
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
                                                onClick={() => handleDelete(doctor.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => {
                                                    setShowInputForDoctor(doctor.id);
                                                    setIsUpdating(true);
                                                    setNewDoctorName(doctor.name);
                                                    setNewDoctorSurname(doctor.surname);
                                                    setNewDoctorDepartment(doctor.department);
                                                    setNewDoctorAddress(doctor.address);
                                                    setNewDoctorIsAvailable(doctor.isAvailable);
                                                }}
                                            >
                                                Update
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
                    <Modal.Title>Add Doctor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateDoctor(); }}>
                        <div className="form-group">
                            <label htmlFor="doctorName">Name:</label>
                            <input
                                type="text"
                                id="doctorName"
                                className="form-control"
                                value={newDoctorName}
                                onChange={(e) => setNewDoctorName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorSurname">Surname:</label>
                            <input
                                type="text"
                                id="doctorSurname"
                                className="form-control"
                                value={newDoctorSurname}
                                onChange={(e) => setNewDoctorSurname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorDepartment">Department:</label>
                            <select
                                id="doctorDepartment"
                                className="form-control"
                                value={newDoctorDepartment}
                                onChange={(e) => setNewDoctorDepartment(e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorAddress">Address:</label>
                            <input
                                type="text"
                                id="doctorAddress"
                                className="form-control"
                                value={newDoctorAddress}
                                onChange={(e) => setNewDoctorAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorIsAvailable">Available:</label>
                            <select
                                id="doctorIsAvailable"
                                className="form-control"
                                value={newDoctorIsAvailable}
                                onChange={(e) => setNewDoctorIsAvailable(e.target.value)}
                                required
                            >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Create Doctor
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

export default Doctor;
