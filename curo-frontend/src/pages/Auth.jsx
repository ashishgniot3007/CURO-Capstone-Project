import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { login as apiLogin, signup as apiSignup } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode = "login" }) {
  const { login } = useAuth();
  const isLogin = mode === "login";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Reset form data and error states when changing modes (login <-> signup)
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setErrors({});
    setApiError("");
    setApiSuccess("");
  }, [mode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  }

  function validateForm() {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
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
        const response = await apiLogin({
          email: formData.email,
          password: formData.password,
        });

        login(response);
        setApiSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        await apiSignup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        setApiSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setApiError(err.message || "An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-14">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">{isLogin ? "Welcome back" : "Create your profile"}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            {isLogin ? "Log in to CURO" : "Join CURO"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl2 border border-line bg-white p-6 shadow-card">
          {/* Success Notification Alert */}
          {apiSuccess && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3.5 text-sm font-medium text-teal-700 animate-fade-in">
              {apiSuccess}
            </div>
          )}

          {/* Error Notification Alert */}
          {apiError && (
            <div className="rounded-lg border border-pulse-soft bg-pulse-dim p-3.5 text-sm font-medium text-pulse animate-shake">
              {apiError}
            </div>
          )}

          {!isLogin && (
            <Field
              label="Full name"
              type="text"
              name="name"
              placeholder="As per ID"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          )}

          <Field
            label="Email address"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          {!isLogin && (
            <Field
              label="Phone number"
              type="text"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          )}

          <Field
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            as="button"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span>{isLogin ? "Logging in..." : "Creating profile..."}</span>
            ) : (
              <span>{isLogin ? "Log in" : "Create profile"}</span>
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {isLogin ? "New to CURO?" : "Already have a profile?"}{" "}
          <Link to={isLogin ? "/signup" : "/login"} className="font-medium text-teal-600 hover:underline">
            {isLogin ? "Create one" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, name, value, onChange, error }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
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
