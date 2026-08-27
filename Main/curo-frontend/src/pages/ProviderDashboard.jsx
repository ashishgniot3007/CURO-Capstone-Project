import { useState, useEffect } from "react";
import Button from "../components/Button";
import ProviderStatsTab from "../components/ProviderStatsTab";
import { useAuth } from "../context/AuthContext";
import {
  getMyProviderProfile,
  updateMyProviderProfile,
  toggleMyProviderActive,
  getMyProviderStats,
  addSlot,
  getSlots,
  listBookings,
} from "../lib/api";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Profile State
  const [profile, setProfile] = useState({
    name: "",
    speciality: "",
    licenseNumber: "",
    phone: "",
    description: "",
    address: "",
    isActive: true,
  });

  // Slots, Bookings & Stats State
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [slotForm, setSlotForm] = useState({ startTime: "", endTime: "" });

  const providerId = user?.userId;

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "slots" && providerId) {
      loadSlots();
    } else if (activeTab === "bookings" && providerId) {
      loadBookings();
    } else if (activeTab === "stats") {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, providerId]);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await getMyProviderProfile();
      if (data) {
        setProfile({
          name: data.name || "", speciality: data.speciality || "", licenseNumber: data.licenseNumber || "",
          phone: data.phone || "", description: data.description || "", address: data.address || "",
          isActive: data.isActive ?? true,
        });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    try {
      // Use an explicit 30-day window for the provider dashboard so providers can view and manage upcoming availability further ahead than the 5-day patient window
      const now = new Date().toISOString();
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const data = await getSlots(providerId, { from: now, to: thirtyDaysLater });
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load slots:", err);
    }
  }

  async function loadBookings() {
    try {
      const data = await listBookings({ providerId });
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  }

  async function loadStats() {
    setStatsLoading(true);
    setStatsError("");
    try {
      const data = await getMyProviderStats();
      setStats(data);
    } catch (err) {
      setStatsError(err.message || "Failed to load stats");
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const updated = await updateMyProviderProfile(profile);
      setProfile((prev) => ({ ...prev, ...(updated || {}) }));
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to update profile" });
    }
  }

  async function handleToggleActive() {
    setMsg({ type: "", text: "" });
    try {
      await toggleMyProviderActive();
      await loadProfile(); // Re-fetch profile to confirm server's actual resulting state
      setMsg({ type: "success", text: "Active status toggled!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to toggle status" });
    }
  }

  async function handleAddSlot(e) {
    e.preventDefault();
    if (!slotForm.startTime || !slotForm.endTime) return;
    setMsg({ type: "", text: "" });
    try {
      await addSlot(providerId, {
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
      });
      setSlotForm({ startTime: "", endTime: "" });
      setMsg({ type: "success", text: "Slot added successfully!" });
      loadSlots();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to add slot" });
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="eyebrow">Provider Portal</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            {profile.name || user?.name || "Provider Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-ink-soft">Status:</span>
          <button
            onClick={handleToggleActive}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              profile.isActive ? "bg-teal-100 text-teal-800 hover:bg-teal-200" : "bg-pulse-dim text-pulse hover:bg-red-100"
            }`}
          >
            {profile.isActive ? "Active (Accepting visits)" : "Inactive"}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`mt-4 rounded-lg border p-3.5 text-sm font-medium ${
          msg.type === "success" ? "border-teal-200 bg-teal-50 text-teal-700" : "border-pulse-soft bg-pulse-dim text-pulse"
        }`}>
          {msg.text}
        </div>
      )}

      {/* Tabs Header */}
      <div className="mt-6 flex border-b border-line gap-6">
        {["profile", "slots", "bookings", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setMsg({ type: "", text: "" }); }}
            className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab ? "border-teal-600 text-teal-700" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-ink-soft">Loading provider details...</div>
        ) : activeTab === "profile" ? (
          <form onSubmit={handleProfileSave} className="max-w-2xl space-y-4 rounded-xl border border-line bg-white p-6 shadow-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-ink-soft">Name</span>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-ink-soft">Speciality</span>
                <input type="text" value={profile.speciality} onChange={(e) => setProfile({ ...profile, speciality: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-ink-soft">License Number</span>
                <input type="text" value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-ink-soft">Phone</span>
                <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-ink-soft">Address</span>
              <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink-soft">Bio / Description</span>
              <textarea rows={3} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
            </label>
            <Button as="button" type="submit" variant="primary" size="md">Save Profile Changes</Button>
          </form>
        ) : activeTab === "slots" ? (
          <div className="space-y-6">
            <form onSubmit={handleAddSlot} className="max-w-2xl rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-ink mb-4">Add Availability Slot</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="block">
                  <span className="text-xs font-medium text-ink-soft">Start Time</span>
                  <input type="datetime-local" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-ink-soft">End Time</span>
                  <input type="datetime-local" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus-visible:border-teal-400" />
                </label>
              </div>
              <Button as="button" type="submit" variant="primary" size="md">Create Slot</Button>
            </form>
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-ink mb-4">Your Created Slots ({slots.length})</h2>
              {slots.length === 0 ? (
                <p className="text-sm text-ink-soft py-4">No slots created yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {slots.map((s) => (
                    <div key={s.id || s.slotId} className="rounded-lg border border-line p-3 text-xs bg-paper">
                      <div className="font-medium text-ink">{s.startTime ? new Date(s.startTime).toLocaleString() : "TBD"}</div>
                      <div className="text-ink-soft mt-1">To: {s.endTime ? new Date(s.endTime).toLocaleString() : "TBD"}</div>
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 font-semibold ${s.isBooked ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"}`}>
                        {s.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "bookings" ? (
          <div className="rounded-xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Patient Appointments ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <p className="text-sm text-ink-soft py-4">No patient bookings found.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.bookingId || b.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-line p-4 text-sm gap-2">
                    <div>
                      <div className="font-medium text-ink">{b.patientName || b.userEmail || `Booking #${b.bookingId || b.id}`}</div>
                      <div className="text-xs text-ink-soft mt-0.5">Slot: {b.slotStartTime ? new Date(b.slotStartTime).toLocaleString() : "Scheduled"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">
                        {b.status || "CONFIRMED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProviderStatsTab stats={stats} loading={statsLoading} error={statsError} />
        )}
      </div>
    </div>
  );
}
