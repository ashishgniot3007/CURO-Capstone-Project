import React from "react";
import "./DoctorDashboard.css";

function DoctorDashboard() {

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    return (
        <div className="doctor-dashboard">

            <header className="doctor-header">

                <div>
                    <h1>CURO</h1>
                    <p>Doctor Dashboard</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>


            <main className="doctor-content">

                <section className="welcome-section">

                    <h2>Welcome, Doctor</h2>

                    <p>
                        Manage your appointments, patients and consultations
                        from one place.
                    </p>

                </section>


                <section className="doctor-stats">

                    <div className="doctor-stat-card">
                        <h3>Today's Appointments</h3>
                        <p>12</p>
                    </div>

                    <div className="doctor-stat-card">
                        <h3>Waiting Patients</h3>
                        <p>4</p>
                    </div>

                    <div className="doctor-stat-card">
                        <h3>Completed</h3>
                        <p>8</p>
                    </div>

                </section>


                <section className="appointments-section">

                    <h2>Today's Appointments</h2>

                    <div className="appointment-list">

                        <div className="appointment-card">

                            <div>
                                <h3>Rahul Sharma</h3>
                                <p>General Consultation</p>
                            </div>

                            <span>10:00 AM</span>

                        </div>


                        <div className="appointment-card">

                            <div>
                                <h3>Ananya Singh</h3>
                                <p>Follow-up</p>
                            </div>

                            <span>11:30 AM</span>

                        </div>


                        <div className="appointment-card">

                            <div>
                                <h3>Rohan Verma</h3>
                                <p>Consultation</p>
                            </div>

                            <span>01:00 PM</span>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default DoctorDashboard;