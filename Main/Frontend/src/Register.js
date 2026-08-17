import React, { useState } from "react";
import axios from "axios";
import "./register.css";

function Register() {

    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        role: "Patient",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (register.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log(register);

        try {
            const response = await axios.post(
                "http://localhost:8082/addUser",
                register
            );

            console.log(response.data);
            alert("User added successfully");

            if (register.role === "Patient") {
                window.location.href = "/home";

            }else if (register.role === "Doctor") {
                window.location.href = "/doctor-dashboard";

            } else if (register.role === "Hospital") {
                window.location.href = "/hospital-dashboard";

            } else if (register.role === "Admin") {
                window.location.href = "/home";
            }

        } catch (error) {
            console.log(error);
            alert("Registration failed");
        }
    };

    return (
    <div className="register-page">

        {/* Navbar */}

        <nav className="register-navbar">

            <div className="register-logo">
                CURO.
            </div>

            <div className="register-nav-links">
                <a href="/home">Home</a>
                <a href="/home">Services</a>
                <a href="/home">About Us</a>
                <a href="/home">Contact</a>
            </div>

            <div className="register-nav-button">

                <button
                    className="register-login-btn"
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                >
                    Login
                </button>

            </div>

        </nav>


        {/* Register section */}

        <div className="register-content">

            <div className="register-card">

                <h1>Create your account</h1>

                <p className="register-subtitle">
                    Join CURO and access healthcare at your fingertips
                </p>


                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={register.name}
                        onChange={handleChange}
                        required
                    />


                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={register.email}
                        onChange={handleChange}
                        required
                    />


                    <label>Role</label>

                    <select
                        name="role"
                        value={register.role}
                        onChange={handleChange}
                    >
                        <option value="Patient">Patient</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Admin">Admin</option>
                    </select>


                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={register.password}
                        onChange={handleChange}
                        required
                    />


                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />


                    <button
                        type="submit"
                        className="register-submit-btn"
                    >
                        Create Account
                    </button>

                </form>


                <p className="register-signin-text">
                    Already have an account?{" "}
                    <a
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        Sign in
                    </a>
                </p>

            </div>

        </div>

    </div>
);
}

export default Register;