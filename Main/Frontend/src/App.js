import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Home from './home';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;