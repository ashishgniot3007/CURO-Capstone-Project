import React from "react";
import "./home.css";

function Home() {

    return (
        <div className="curo-app">

            {/* Navigation Bar */}
            <header className="navbar">

                <div className="logo">
                    CURO<span>.</span>
                </div>

                <nav>
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
                </nav>

                <button className="cta-btn-nav" onClick={() => window.location.href = "/appointment"}>
                    Book Appointment
                </button>

            </header>


            {/* Hero Section */}
            <section id="home" className="hero">

                <div className="hero-content">

                    <h1>
                        Your Health, Our Top Priority
                    </h1>

                    <p>
                        CURO provides advanced, compassionate,
                        and reliable healthcare services tailored
                        to you and your family's needs.
                    </p>

                    <div className="hero-buttons">

                        <button className="primary-btn">
                            Find a Doctor
                        </button>

                        <button className="secondary-btn">
                            Learn More
                        </button>

                    </div>

                </div>


                <div className="hero-image">

                    <div className="placeholder-card">

                        <h3>24/7 Emergency</h3>

                        <p>
                            Always here when you need us most.
                        </p>

                    </div>

                </div>

            </section>


            {/* Services */}
            <section id="services" className="services">

                <h2>Our Medical Services</h2>

                <div className="service-grid">

                    <div className="service-card">
                        <h3>Cardiology</h3>
                        <p>
                            Expert heart care with advanced
                            diagnostic tools.
                        </p>
                    </div>

                    <div className="service-card">
                        <h3>Neurology</h3>
                        <p>
                            Comprehensive care for brain,
                            spine, and nerve conditions.
                        </p>
                    </div>

                    <div className="service-card">
                        <h3>Pediatrics</h3>
                        <p>
                            Gentle and friendly healthcare
                            for your children.
                        </p>
                    </div>

                    <div className="service-card">
                        <h3>Diagnostics</h3>
                        <p>
                            Fast and accurate lab tests
                            and imaging services.
                        </p>
                    </div>

                    <div className="service-card">
                        <h3>Patient Care</h3>
                        <p>
                            Personalized care plans and
                            patient support services.
                        </p>
                    </div>

                    <div className="service-card">
                        <h3>Emergency Response</h3>
                        <p>
                            Rapid emergency medical response
                            available 24/7.
                        </p>
                    </div>

                </div>

            </section>


            {/* Footer */}
            <footer id="contact" className="footer">

                <h3>CURO Healthcare</h3>

                <p>
                    Call us: +1 (800) 555-CURO |
                    Email: support@curohealth.com
                </p>

                <p>
                    © 2026 CURO. All rights reserved.
                </p>

            </footer>

        </div>
    );
}

export default Home;