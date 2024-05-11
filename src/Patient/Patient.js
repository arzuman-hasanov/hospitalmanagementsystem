import React, { useState, useEffect } from 'react';
import { fetchDoctors, createAppointment } from '../api'; // Import generic API functions
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Patient() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const doctorsData = await fetchDoctors();
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching Doctors:', error);
                setError(error.message);
            }
        };

        fetchDataFromAPI();
    }, []);

    const handleMakeAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setShowAppointmentModal(true);
    };

    const handleAppointmentConfirmation = async () => {
        try {
            await createAppointment(selectedDoctor.id, selectedDate);

            Swal.fire({
                icon: 'success',
                title: 'Appointment Created',
                text: `Your appointment with Dr. ${selectedDoctor.name} ${selectedDoctor.surname} on ${selectedDate} has been successfully created.`,
            });

            setShowAppointmentModal(false);
            setSelectedDoctor(null);
            setSelectedDate('');
        } catch (error) {
            console.error('Error creating appointment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create appointment. Please try again.',
            });
        }
    };

    const handleCancelAppointment = () => {
        setShowAppointmentModal(false);
        setSelectedDoctor(null);
        setSelectedDate('');
    };

    return (
        <div>
            {error && <p>Error: {error}</p>}
            <h2>Doctors List</h2>
            <div className="row">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{doctor.name} {doctor.surname}</h5>
                                <p className="card-text">Available: {doctor.isAvailable ? 'Yes' : 'No'}</p>
                                <button className="btn btn-primary" onClick={() => handleMakeAppointment(doctor)}>Make Appointment</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showAppointmentModal} onHide={handleCancelAppointment}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Selected Doctor: {selectedDoctor && `${selectedDoctor.name} ${selectedDoctor.surname}`}</h5>
                    <h5>Available: {selectedDoctor && (selectedDoctor.isAvailable ? 'Yes' : 'No')}</h5>
                    <div className="form-group">
                        <label htmlFor="appointmentDate">Select Date:</label>
                        <select
                            id="appointmentDate"
                            className="form-control"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                        >
                            <option value="">Select Date</option>
                            {/* You can add options for available dates here */}
                        </select>
                    </div>
                    <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleAppointmentConfirmation}>
                            Confirm Appointment
                        </Button>
                        <Button variant="secondary" onClick={handleCancelAppointment}>
                            Cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Patient;
