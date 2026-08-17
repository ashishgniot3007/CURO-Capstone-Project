import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Home from './home';
import DoctorDashboard from "./DoctorDashboard";
import HospitalDashboard from "./HospitalDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />}/>
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} 
/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;