import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { providerLogin, providerSignup } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function ProviderAuth({ mode = "login" }) {
  const { login } = useAuth();
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    type: "DOCTOR",
    speciality: "General Practice",
    licenseNumber: "",
    description: "",
    lat: "0",
    lng: "0",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNote, setGeoNote] = useState("");

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      type: "DOCTOR",
      speciality: "General Practice",
      licenseNumber: "",
      description: "",
      lat: "0",
      lng: "0",
      address: "",
    });
    setErrors({});
    setApiError("");
    setApiSuccess("");
    setGeoNote("");
  }, [mode]);

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setGeoNote("Geolocation is not supported by your browser. Profile can be geocoded later.");
      return;
    }
    setGeoLoading(true);
    setGeoNote("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString(),
        }));
        setGeoLoading(false);
      },
      (err) => {
        console.log("Geolocation error:", err);
        setGeoNote("Geolocation unavailable or denied. Profile can be geocoded later.");
        setGeoLoading(false);
      }
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.speciality.trim()) newErrors.speciality = "Speciality is required";
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setApiError("");
    setApiSuccess("");

    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const response = await providerLogin({
          email: formData.email,
          password: formData.password,
        });
        login(response, "provider");
        setApiSuccess("Provider login successful! Redirecting...");
        setTimeout(() => navigate("/provider/dashboard"), 1000);
      } else {
        const response = await providerSignup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          type: formData.type,
          speciality: formData.speciality,
          licenseNumber: formData.licenseNumber,
          description: formData.description,
          lat: parseFloat(formData.lat) || 0,
          lng: parseFloat(formData.lng) || 0,
          address: formData.address,
        });
        login(response, "provider");
        setApiSuccess("Provider profile created! Redirecting to dashboard...");
        setTimeout(() => navigate("/provider/dashboard"), 1000);
      }
    } catch (err) {
      setApiError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-14">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <span className="eyebrow">{isLogin ? "Provider Portal" : "Join as Provider"}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            {isLogin ? "Provider Log In" : "Register Provider Account"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl2 border border-line bg-white p-6 shadow-card">
          {apiSuccess && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3.5 text-sm font-medium text-teal-700 animate-fade-in">
              {apiSuccess}
            </div>
          )}

          {apiError && (
            <div className="rounded-lg border border-pulse-soft bg-pulse-dim p-3.5 text-sm font-medium text-pulse animate-shake">
              {apiError}
            </div>
          )}

          {!isLogin && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name / Facility Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                <label className="block">
                  <span className="text-xs font-medium text-ink-soft">Provider Type</span>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus-visible:border-teal-400"
                  >
                    <option value="DOCTOR">Doctor</option>
                    <option value="HOSPITAL">Hospital</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Speciality" name="speciality" placeholder="e.g. Cardiology" value={formData.speciality} onChange={handleChange} error={errors.speciality} />
                <Field label="License Number" name="licenseNumber" placeholder="MD-12345" value={formData.licenseNumber} onChange={handleChange} error={errors.licenseNumber} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Phone" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <Field label="Address" name="address" placeholder="123 Medical Way" value={formData.address} onChange={handleChange} />
              </div>

              <div className="space-y-2 rounded-lg border border-line bg-paper/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-soft">Practice Coordinates</span>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={geoLoading}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline disabled:opacity-50"
                  >
                    {geoLoading ? "Locating..." : "Use my current location"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Latitude" type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} />
                  <Field label="Longitude" type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} />
                </div>
                {geoNote && (
                  <p className="text-[11px] text-ink-soft/80 italic">{geoNote}</p>
                )}
              </div>
            </>
          )}

          <Field label="Email Address" type="email" name="email" placeholder="doctor@clinic.com" value={formData.email} onChange={handleChange} error={errors.email} />
          <Field label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} />

          {!isLogin && (
            <label className="block">
              <span className="text-xs font-medium text-ink-soft">Description / Bio</span>
              <textarea
                name="description"
                rows={2}
                placeholder="Brief description of practice..."
                value={formData.description}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400"
              />
            </label>
          )}

          <Button as="button" type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? (isLogin ? "Signing in..." : "Registering...") : (isLogin ? "Sign In as Provider" : "Register Provider")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {isLogin ? "New provider?" : "Already registered?"}{" "}
          <Link to={isLogin ? "/provider/signup" : "/provider/login"} className="font-medium text-teal-600 hover:underline">
            {isLogin ? "Create provider account" : "Log in here"}
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-ink-soft">
          Looking for patient portal?{" "}
          <Link to="/login" className="font-medium text-teal-600 hover:underline">
            Patient Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = "text", step, placeholder, name, value, onChange, error }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        step={step}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
          error ? "border-pulse focus-visible:border-pulse" : "border-line focus-visible:border-teal-400"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-pulse">{error}</span>}
    </label>
  );
}
