import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import { getProvider, getSlots } from "../lib/api";

function formatSlotTime(startTime) {
  const date = new Date(startTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatSlotDate(startTime) {
  const date = new Date(startTime);
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const [prov, slotList] = await Promise.all([
          getProvider(id),
          getSlots(id, {
            from: new Date().toISOString(),
            to: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        ]);
        if (active) {
          setDoctor({
            ...prov,
            initials: prov.name
              ? prov.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "Dr",
          });
          setSlots(slotList);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchDetails();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container-page py-14 text-center text-ink-soft">Loading provider profile...</div>;
  }

  if (error || !doctor) {
    return <Navigate to="/doctors" replace />;
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/doctors" className="text-sm text-ink-soft hover:text-teal-600">&larr; All providers</Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: profile */}
        <div>
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 font-display text-2xl font-semibold text-teal-700">
              {doctor.initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{doctor.name}</h1>
              <p className="mt-1 text-sm text-ink-soft">{doctor.speciality} &middot; {doctor.type}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span className="text-sm text-ink-soft">&#9733; {doctor.rating} ({doctor.reviewsCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl2 border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Dr. {doctor.name.split(" ").slice(-1)} specialises in {doctor.speciality.toLowerCase()}.
              Consultations are scheduled via secure time slots, and reports are updated directly to your account.
            </p>
          </div>

          <div className="mt-6 rounded-xl2 border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Upcoming Slots (Next 5 Days)</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.length > 0 ? (
                slots.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-lg border p-3.5 text-center transition-colors ${
                      s.status === "AVAILABLE"
                        ? "border-teal-100 bg-teal-50/50 hover:border-teal-300"
                        : "border-line bg-paper-dim opacity-70"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-ink-soft">{formatSlotDate(s.startTime)}</div>
                    <div className="font-mono text-sm font-semibold text-teal-700 mt-1">{formatSlotTime(s.startTime)}</div>
                    <div className="text-[10px] font-medium text-ink-soft/75 mt-1">{s.status}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center text-sm text-ink-soft">
                  No slots scheduled for this provider.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: booking summary card */}
        <aside className="h-fit rounded-xl2 border border-line bg-white p-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Provider Speciality</span>
            <span className="font-display text-sm font-semibold text-ink">{doctor.speciality}</span>
          </div>

          <Button to={`/doctors/${doctor.id}/book`} variant="primary" size="lg" className="mt-5 w-full">
            Book a Visit
          </Button>
          <p className="mt-3 text-center text-xs text-ink-soft/70">
            Select a slot to confirm your appointment.
          </p>
        </aside>
      </div>
    </div>
  );
}
