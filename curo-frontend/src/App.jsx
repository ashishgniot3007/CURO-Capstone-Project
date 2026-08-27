import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import RouteProgressBar from "./components/RouteProgressBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import DoctorProfile from "./pages/DoctorProfile";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ProviderAuth from "./pages/ProviderAuth";
import ProviderDashboard from "./pages/ProviderDashboard";
import { useAuth } from "./context/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RequireAuth({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireProvider({ children }) {
  const { token, userType } = useAuth();

  if (!token) {
    return <Navigate to="/provider/login" replace />;
  }

  if (userType !== "provider") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <RouteProgressBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Search />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/doctors/:id/book" element={<Booking />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/provider/login" element={<ProviderAuth mode="login" />} />
          <Route path="/provider/signup" element={<ProviderAuth mode="signup" />} />
          <Route path="/provider/dashboard" element={
            <RequireProvider>
              <ProviderDashboard />
            </RequireProvider>
          } />
        </Routes>
      </main>
      <Footer />
      </div>
  );
}
