import React, { useState } from 'react';
import { createDepartment } from './api'; // Import createDepartment function from api.js

function DepartmentForm() {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Call createDepartment function with department name
            await createDepartment({ name });
            // Reset form field after successful submission
            setName('');
            // Optionally, you can add a success message or redirect to another page
        } catch (error) {
            console.error('Error creating department:', error);
            setError(error.message); // Set error state
        }
    };

    return (
        <div>
            <h2>Create Department</h2>
            {error && <p>Error: {error}</p>} {/* Display error message if error state is set */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Department</button>
            </form>
        </div>
    );
}

export default DepartmentForm;