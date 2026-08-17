import React, { useState } from "react";
import axios from "axios";
import "./login.css";

function Login() {

    const [password, setPasswordValue] = useState("");
    const [userId, setUserIdValue] = useState("");

    const setPassword = (e) => {
        setPasswordValue(e.target.value);
    };

    const setUserId = (e) => {
        setUserIdValue(e.target.value);
    };

    const handleSubmit = async (e) => {

        console.log("LOGIN BUTTON CLICKED");

        e.preventDefault();

        // API call
        console.log("this is our data " + userId + "   " + password);

        // Create object for API
        const data = {
            userId: userId,
            password: password
        };

        try {

            const response = await axios.post(
                "http://localhost:8082/loginUser",
                data
            );

            console.log("this is the response ", response.data);

            if (!response.data.success) {

                alert("Invalid User Id or Password");

            } else {

                alert("Login Successful");

                // Save login information
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", response.data.role);

                // Redirect according to role
                if (response.data.role === "Patient") {

                    window.location.href = "/home";

                } else if (response.data.role === "Doctor") {

                    window.location.href = "/doctor-dashboard";

                } else if (response.data.role === "Hospital") {

                    window.location.href = "/hospital-dashboard";

                } else if (response.data.role === "Admin") {

                    window.location.href = "/home";
                }
            }

        } catch (error) {

            console.error(error);
            alert("Login API failed");
        }
    };

    const redirectToRegister = () => {
        window.location.href = "/register";
    };

    return (
        <div className="login-page">

            {/* Navbar */}

            <nav className="login-navbar">

                <div className="login-logo">
                    CURO.
                </div>

                <div className="login-nav-links">

                    <a href="/home">Home</a>
                    <a href="/home">Services</a>
                    <a href="/home">About Us</a>
                    <a href="/home">Contact</a>

                </div>

                <div className="login-nav-buttons">

                    <button
                        className="login-register-btn"
                        onClick={redirectToRegister}
                    >
                        Register
                    </button>

                </div>

            </nav>


            {/* Login Section */}

            <div className="login-content">

                <div className="login-card">

                    <h1>Welcome Back</h1>

                    <p className="login-subtitle">
                        Sign in to your CURO account
                    </p>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={userId}
                            onChange={setUserId}
                            required
                        />


                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={setPassword}
                            required
                        />


                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                        </button>

                    </form>


                    <p className="login-register-text">

                        Don't have an account?{" "}

                        <a onClick={redirectToRegister}>
                            Register
                        </a>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;