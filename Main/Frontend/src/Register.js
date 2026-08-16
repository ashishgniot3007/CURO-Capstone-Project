import React, { useState } from "react";
import axios from "axios";
import "./register.css";

function Register() {

    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
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
            window.location.href = "/home";

        } catch (error) {
            console.log(error);
            alert("Registration failed");
        }
    };

    return (
        <div className="register-page">

            <div className="curo-header">
                <div className="curo-logo">Curo</div>
                <div className="curo-tagline">
                    Healthcare at your fingertips
                </div>
            </div>

            <div className="register-card">

                <h1>Create your account</h1>

                <p className="signin-text">
                    Already have an account?{" "}
                    <a href="/login">Sign in</a>
                </p>

                <form onSubmit={handleSubmit}>

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

                    <select defaultValue="Patient">
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

                    <button type="submit">
                        Create Account
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Register;