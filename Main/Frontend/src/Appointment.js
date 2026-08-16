import React, { useState } from "react";
import "./Appointment.css";

function Appointment() {

    const [appointment, setAppointment] = useState({
        patientName: "",
        service: "",
        date: "",
        time: "",
        day: ""
    });

    const handleChange = (e) => {
        setAppointment({
            ...appointment,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(appointment);
        alert("Appointment booked successfully");
    };

    return (
        <div className="appointment-page">

            <div className="appointment-card">

                <div className="appointment-header">
                    <h1>Book Appointment</h1>
                    <p>Schedule your appointment with CURO Healthcare</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <label>Patient Name</label>

                    <input
                        type="text"
                        name="patientName"
                        placeholder="Enter your name"
                        value={appointment.patientName}
                        onChange={handleChange}
                        required
                    />

                    <label>Select Doctor / Service</label>

                    <select
                        name="service"
                        value={appointment.service}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a service</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Diagnostics">Diagnostics</option>
                        <option value="Patient Care">Patient Care</option>
                        <option value="Emergency Response">
                            Emergency Response
                        </option>
                    </select>

                    <label>Select Date</label>

                    <input
                        type="date"
                        name="date"
                        value={appointment.date}
                        onChange={handleChange}
                        required
                    />

                    <label>Select Time</label>

                    <input
                        type="time"
                        name="time"
                        value={appointment.time}
                        onChange={handleChange}
                        required
                    />

                    
                    <button type="submit">
                        Book Appointment
                    </button>

                </form>

                <button
                    className="back-home"
                    onClick={() => window.location.href = "/home"}
                >
                    Back to Home
                </button>

            </div>

        </div>
    );
}

export default Appointment;