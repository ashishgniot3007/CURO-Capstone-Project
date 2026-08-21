import { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { listBookings, getProvider, getSlot, cancelBooking, getUserProfile } from "../lib/api";

const TABS = ["Appointments", "Profile"];

export default function Dashboard() {
  const { user } = useAuth();
  return <PatientDashboard patient={user} />;
}

function PatientDashboard({ patient }) {
  const [tab, setTab] = useState("Appointments");
  const { logout } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingsList = await listBookings();
      const providerCache = {};
      const slotCache = {};

      const detailedBookings = await Promise.all(
        bookingsList.map(async (booking) => {
          const pid = booking.providerId;
          const sid = booking.slotId;

          // Fetch provider details
          if (!providerCache[pid]) {
            try {
              providerCache[pid] = await getProvider(pid);
            } catch {
              providerCache[pid] = { name: `Provider #${pid}`, speciality: "Unknown" };
            }
          }
          const provider = providerCache[pid];

          // Fetch slot details
          const slotKey = `${pid}_${sid}`;
          if (!slotCache[slotKey]) {
            try {
              slotCache[slotKey] = await getSlot(pid, sid);
            } catch {
              slotCache[slotKey] = { startTime: booking.createdAt };
            }
          }
          const slot = slotCache[slotKey];

          const startDate = new Date(slot.startTime);
          const dateStr = startDate.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
          const timeStr = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return {
            ...booking,
            date: dateStr,
            time: timeStr,
            provider: {
              ...provider,
              initials: provider.name
                ? provider.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "Dr",
            },
          };
        })
      );
      setAppointments(detailedBookings);
    } catch (err) {
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!patient?.userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProfile(patient.userId);
      setProfileData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch profile details");
    } finally {
      setLoading(false);
    }
  }, [patient?.userId]);

  useEffect(() => {
    if (tab === "Appointments") {
      fetchAppointments();
    } else if (tab === "Profile") {
      fetchProfile();
    }
  }, [tab, fetchAppointments, fetchProfile]);

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelBooking(bookingId);
      fetchAppointments();
    } catch (err) {
      alert(err.message || "Failed to cancel appointment");
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-1">
        <span className="eyebrow">Dashboard</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {profileData?.name || patient?.email?.split("@")[0] || "User"}
        </h1>
      </div>

      <div className="mt-6 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-teal-500 text-teal-600" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Appointments" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-full py-8 text-center text-ink-soft text-sm">Loading appointments...</div>
          ) : error ? (
            <div className="col-span-full py-8 text-center text-pulse text-sm font-medium">{error}</div>
          ) : appointments.length > 0 ? (
            appointments.map((a) => (
              <div key={a.id} className="rounded-xl2 border border-line bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 font-display text-sm font-semibold text-teal-700">
                      {a.provider.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{a.provider.name}</div>
                      <div className="text-xs text-ink-soft">{a.provider.speciality}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    a.status === "CONFIRMED" ? "bg-teal-50 text-teal-700" : "bg-paper-dim text-ink-soft"
                  }`}>
                    {a.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 font-mono text-xs text-ink-soft">
                  <div>
                    <div className="text-ink-soft/60">Date</div>
                    <div className="mt-0.5 font-medium text-ink">{a.date}</div>
                  </div>
                  <div>
                    <div className="text-ink-soft/60">Time</div>
                    <div className="mt-0.5 font-medium text-ink">{a.time}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {a.status !== "CANCELLED" && (
                    <Button as="button" onClick={() => handleCancel(a.id)} variant="secondary" size="sm" className="w-full">
                      Cancel Appointment
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-ink-soft text-sm">
              No appointments found.
            </div>
          )}

          <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line p-8 text-center lg:col-span-2">
            <p className="text-sm text-ink-soft">Need to book another visit?</p>
            <Button to="/doctors" variant="ghost" size="sm" className="mt-2">
              Book another appointment &rarr;
            </Button>
          </div>
        </div>
      )}

      {tab === "Profile" && (
        <div className="mt-6 max-w-lg rounded-xl2 border border-line bg-white p-6">
          {loading && !profileData ? (
            <div className="text-ink-soft text-sm">Loading profile details...</div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Full name" value={profileData?.name || "N/A"} />
                <ProfileField label="Phone" value={profileData?.phone || "N/A"} />
                <ProfileField label="Email" value={profileData?.email || patient?.email || "N/A"} />
              </div>
              <div className="mt-6 flex gap-3">
                <Button as="button" onClick={logout} variant="secondary" size="md" className="w-full">
                  Log out
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        value={value}
        readOnly
        className="mt-1.5 w-full rounded-lg border border-line bg-paper-dim px-3.5 py-2.5 text-sm outline-none cursor-not-allowed"
      />
    </label>
  );
}
