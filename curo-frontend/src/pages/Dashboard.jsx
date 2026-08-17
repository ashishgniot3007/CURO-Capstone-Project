import { useState, useEffect } from "react";
import Button from "../components/Button";
import { upcomingAppointments, records, doctors } from "../data/mock";
import { getToken } from "../lib/auth";

const TABS = ["Appointments", "Records", "Profile"];

// Helper to decode user email and role from mock token
function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  if (token.startsWith("mock-session-token-")) {
    try {
      const decoded = atob(token.replace("mock-session-token-", ""));
      const [email, role] = decoded.split(":");
      return { email, role };
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Helper to get user details and role based on email and token decoded info
function getUserDetails(email, role) {
  if (!email) return null;
  const lowerEmail = email.toLowerCase();

  // Try to load dynamic profile registered in the browser first
  const saved = localStorage.getItem(`user_profile_${lowerEmail}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Try to find if this doctor matches one of our mock doctors
      const match = doctors.find((d) => d.name.toLowerCase() === parsed.name.toLowerCase());
      return {
        name: parsed.name,
        role: parsed.role || role,
        doctorId: match?.id || "d1",
        speciality: match?.speciality || "General Medicine",
        hospital: match?.hospital || "City Health Clinic",
      };
    } catch (e) {}
  }

  // Predefined developer / mock user logins
  if (lowerEmail === "anjali@curo.com") {
    return { name: "Dr. Anjali Rao", role: "Doctor", doctorId: "d1", speciality: "Cardiology", hospital: "Sunrise Heart Institute" };
  } else if (lowerEmail === "karan@curo.com") {
    return { name: "Dr. Karan Mehta", role: "Doctor", doctorId: "d2", speciality: "Dermatology", hospital: "Skinlogy Clinic" };
  } else if (lowerEmail === "priya@curo.com") {
    return { name: "Dr. Priya Nair", role: "Doctor", doctorId: "d3", speciality: "Pediatrics", hospital: "Little Steps Children's Hospital" };
  }

  return {
    name: "Priya Sharma",
    role: "Patient",
  };
}

export default function Dashboard() {
  const user = getCurrentUser();
  const details = getUserDetails(user?.email, user?.role);

  if (details?.role === "Doctor") {
    return <DoctorDashboard doctor={details} />;
  }

  return <PatientDashboard patient={details} />;
}

function DoctorDashboard({ doctor }) {
  const initialQueue = [
    { token: "#14", name: "Priya Sharma", mode: "In-clinic", time: "4:40 PM", status: "Active" },
    { token: "#15", name: "Rohan Sharma", mode: "In-clinic", time: "5:00 PM", status: "Waiting" },
    { token: "#16", name: "Sneha Patel", mode: "Online", time: "5:15 PM", status: "Waiting" },
    { token: "#17", name: "Amit Verma", mode: "In-clinic", time: "5:30 PM", status: "Waiting" }
  ];

  const [queue, setQueue] = useState(() => {
    const saved = localStorage.getItem(`doctor_queue_${doctor.doctorId}`);
    return saved ? JSON.parse(saved) : initialQueue;
  });

  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  useEffect(() => {
    localStorage.setItem(`doctor_queue_${doctor.doctorId}`, JSON.stringify(queue));
  }, [queue, doctor.doctorId]);

  const activePatient = queue.find(p => p.status === "Active");
  const waitingPatients = queue.filter(p => p.status === "Waiting");

  const handleCallPatient = () => {
    if (!activePatient) return;
    setCalling(true);
    setCallStatus("Calling...");
    setTimeout(() => {
      setCallStatus("Call Connected");
    }, 1500);
  };

  const handleMarkDone = () => {
    if (!activePatient) return;
    
    const updatedQueue = queue.filter(p => p.token !== activePatient.token);
    if (updatedQueue.length > 0 && waitingPatients.length > 0) {
      updatedQueue[0].status = "Active";
    }
    
    setQueue(updatedQueue);
    setCalling(false);
    setCallStatus("");
  };

  const handleCallNext = () => {
    if (waitingPatients.length === 0) return;
    
    const nextPatient = waitingPatients[0];
    const updatedQueue = queue
      .filter(p => p.status !== "Active")
      .map(p => p.token === nextPatient.token ? { ...p, status: "Active" } : p);
      
    setQueue(updatedQueue);
    setCalling(false);
    setCallStatus("");
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-1">
        <span className="eyebrow">{doctor.speciality} &middot; {doctor.hospital}</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{doctor.name}</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Active Patient */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6 shadow-card">
            <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">Current Patient</h2>
            
            {activePatient ? (
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-4xl font-bold text-teal-600">{activePatient.token}</div>
                    <h3 className="mt-2 text-xl font-semibold text-ink">{activePatient.name}</h3>
                    <p className="text-sm text-ink-soft">Scheduled for {activePatient.time}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    activePatient.mode === "Online" ? "bg-teal-50 text-teal-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {activePatient.mode}
                  </span>
                </div>

                {callStatus && (
                  <div className={`mt-4 rounded-lg p-3 text-sm font-medium border ${
                    callStatus === "Call Connected" 
                      ? "border-teal-200 bg-teal-50 text-teal-700" 
                      : "border-blue-200 bg-blue-50 text-blue-700 animate-pulse"
                  }`}>
                    {callStatus}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleCallPatient}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 bg-teal-500 text-white hover:bg-teal-600 shadow-lift text-sm px-4 py-2.5"
                  >
                    Call Patient
                  </button>
                  <button
                    onClick={handleMarkDone}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 bg-white text-ink border border-line hover:border-teal-400 hover:text-teal-600 text-sm px-4 py-2.5"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-8 text-ink-soft">
                No active patient. Click "Start Next Patient" below to begin.
              </div>
            )}
          </div>
          
          {waitingPatients.length > 0 && !activePatient && (
            <button
              onClick={handleCallNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 bg-teal-500 text-white hover:bg-teal-600 shadow-lift text-sm px-6 py-3.5"
            >
              Start Next Patient
            </button>
          )}
        </div>

        {/* Right Column: Waiting List */}
        <div className="rounded-xl2 border border-line bg-white p-6 shadow-card h-fit">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">Waiting Queue</h2>
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
              {waitingPatients.length} patients
            </span>
          </div>

          {waitingPatients.length > 0 ? (
            <div className="mt-4 divide-y divide-line">
              {waitingPatients.map((p, idx) => (
                <div key={p.token} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-600">{p.token}</span>
                      <span className="text-sm font-semibold text-ink">{p.name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
                      <span>{p.time}</span>
                      <span>&middot;</span>
                      <span>{p.mode}</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <button
                      onClick={handleCallNext}
                      className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 bg-white text-ink border border-line hover:border-teal-400 hover:text-teal-600 text-xs px-3 py-1.5"
                    >
                      Check Next
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-8 text-ink-soft text-sm">
              No patients waiting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientDashboard({ patient }) {
  const [tab, setTab] = useState("Appointments");

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-1">
        <span className="eyebrow">Welcome back</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{patient?.name || "Priya Sharma"}</h1>
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
          {upcomingAppointments.map((a) => (
            <div key={a.id} className="rounded-xl2 border border-line bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 font-display text-sm font-semibold text-teal-700">
                    {a.doctor.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{a.doctor.name}</div>
                    <div className="text-xs text-ink-soft">{a.doctor.speciality}</div>
                  </div>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700">
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
                <div className="col-span-2">
                  <div className="text-ink-soft/60">Mode</div>
                  <div className="mt-0.5 font-medium text-ink">{a.mode}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button to={`/queue/${a.doctor.id}`} variant="primary" size="sm" className="flex-1">
                  Track queue
                </Button>
                <Button as="button" variant="secondary" size="sm" className="flex-1">
                  Reschedule
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line p-8 text-center lg:col-span-2">
            <p className="text-sm text-ink-soft">Need to see someone else?</p>
            <Button to="/doctors" variant="ghost" size="sm" className="mt-2">
              Book another appointment &rarr;
            </Button>
          </div>
        </div>
      )}

      {tab === "Records" && (
        <div className="mt-6 divide-y divide-line rounded-xl2 border border-line bg-white">
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-sm font-medium text-ink">{r.title}</div>
                <div className="mt-0.5 text-xs text-ink-soft">{r.doctor} &middot; {r.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700">{r.type}</span>
                <Button as="button" variant="ghost" size="sm">Download</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Profile" && (
        <div className="mt-6 max-w-lg rounded-xl2 border border-line bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Full name" value={patient?.name || "Priya Sharma"} />
            <ProfileField label="Phone" value="+91 98XXXXXX10" />
            <ProfileField label="Email" value={patient?.email || "priya.sharma@email.com"} />
            <ProfileField label="Date of birth" value="14 Mar 1994" />
          </div>
          <Button as="button" variant="primary" size="md" className="mt-6">
            Save changes
          </Button>
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
        defaultValue={value}
        className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus-visible:border-teal-400"
      />
    </label>
  );
}
