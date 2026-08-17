import React from "react";
import "./HospitalDashboard.css";

function HospitalDashboard() {

    const logout = () => {
        window.location.href = "/login";
    };

    return (
        <div className="hospital-dashboard">

            <header className="hospital-header">

                <div>
                    <h1>CURO</h1>
                    <p>Hospital Dashboard</p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>

            </header>


            <main className="hospital-content">

                <section className="welcome-section">

                    <h2>Welcome, Hospital</h2>

                    <p>
                        Manage your hospital, doctors, patients and appointments
                        from one place.
                    </p>

                </section>


                <section className="hospital-stats">

                    <div className="hospital-stat-card">
                        <h3>Total Doctors</h3>
                        <p>24</p>
                    </div>

                    <div className="hospital-stat-card">
                        <h3>Today's Appointments</h3>
                        <p>48</p>
                    </div>

                    <div className="hospital-stat-card">
                        <h3>Available Beds</h3>
                        <p>32</p>
                    </div>

                </section>


                <section className="hospital-section">

                    <h2>Hospital Overview</h2>

                    <div className="hospital-options">

                        <div className="hospital-option-card">
                            <h3>Doctors</h3>
                            <p>
                                View and manage doctors working at the hospital.
                            </p>
                        </div>

                        <div className="hospital-option-card">
                            <h3>Patients</h3>
                            <p>
                                View registered patients and their information.
                            </p>
                        </div>

                        <div className="hospital-option-card">
                            <h3>Appointments</h3>
                            <p>
                                Manage appointments and consultations.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default HospitalDashboard;