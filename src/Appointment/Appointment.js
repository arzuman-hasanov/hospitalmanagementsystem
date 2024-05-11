import React, { useState, useEffect } from 'react';
import { fetchDoctors, createAppointment } from '../api'; // Import generic API functions
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Appointment() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [patientName, setPatientName] = useState('');
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
            const datetime = `${selectedDate} ${selectedTime}:00`;
            const startDateTime = new Date(datetime);
            const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000)); // Add 1 hour in milliseconds
    
            const formattedStart = startDateTime.toISOString().slice(0, 19).replace('T', ' ');
            const formattedEnd = endDateTime.toISOString().slice(0, 19).replace('T', ' ');
    
            const appointmentData = {
                doctorId: selectedDoctor.id,
                doctorName: `${selectedDoctor.name} ${selectedDoctor.surname}`,
                patientId: 1,
                patientName: patientName,
                start: formattedStart,
                end: formattedEnd
            };
    
            console.log("Appointment Data:", appointmentData);
    
            await createAppointment(appointmentData);
    
            Swal.fire({
                icon: 'success',
                title: 'Appointment Created',
                text: `Your appointment with Dr. ${selectedDoctor.name} ${selectedDoctor.surname} on ${formattedStart} has been successfully created.`,
            });
    
            setShowAppointmentModal(false);
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedTime('');
            setPatientName('');
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
        setSelectedTime('');
        setPatientName('');
    };

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour <= 20; hour++) {
            const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
            options.push(`${formattedHour}:00`);
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

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
                {doctor.isAvailable && (
                    <button className="btn btn-primary" onClick={() => handleMakeAppointment(doctor)}>Make Appointment</button>
                )}
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
                        <input
                            id="appointmentDate"
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appointmentTime">Select Time:</label>
                        <select
                            id="appointmentTime"
                            className="form-control"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="">Select Time</option>
                            {timeOptions.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="patientName">Your Name:</label>
                        <input
                            id="patientName"
                            type="text"
                            className="form-control"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            required
                        />
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

export default Appointment;
