import { useParams, Link, Navigate } from "react-router-dom";
import Button from "../components/Button";
import StatusDot from "../components/StatusDot";
import PulseTicker from "../components/PulseTicker";
import { doctors } from "../data/mock";

const SLOTS = ["2:30 PM", "3:00 PM", "3:45 PM", "4:40 PM", "5:15 PM", "6:00 PM"];

export default function DoctorProfile() {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) return <Navigate to="/doctors" replace />;

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/doctors" className="text-sm text-ink-soft hover:text-teal-600">&larr; All doctors</Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: profile */}
        <div>
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 font-display text-2xl font-semibold text-teal-700">
              {doctor.initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{doctor.name}</h1>
              <p className="mt-1 text-sm text-ink-soft">{doctor.qualification} &middot; {doctor.speciality}</p>
              <p className="text-sm text-ink-soft">{doctor.hospital}, {doctor.locality}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <StatusDot status={doctor.status} />
                <span className="text-sm text-ink-soft">&#9733; {doctor.rating} ({doctor.reviews} reviews)</span>
                <span className="text-sm text-ink-soft">{doctor.experience} yrs experience</span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl2 border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Dr. {doctor.name.split(" ").slice(-1)} specialises in {doctor.speciality.toLowerCase()} with
              {" "}{doctor.experience} years of clinical experience at {doctor.hospital}. Consultations are
              available both online and in person, with digital prescriptions and reports shared directly
              to your CURO health record after every visit.
            </p>
          </div>

          <div className="mt-6 rounded-xl2 border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Today's slots</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {SLOTS.map((s, i) => (
                <button
                  key={s}
                  className={`rounded-lg border px-3 py-2.5 font-mono text-xs font-medium transition-colors ${
                    i === 3
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-line text-ink-soft hover:border-teal-300 hover:text-teal-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: booking summary card */}
        <aside className="h-fit rounded-xl2 border border-line bg-white p-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Consultation fee</span>
            <span className="font-mono text-xl font-semibold text-ink">{"\u20b9"}{doctor.fee}</span>
          </div>

          {doctor.status !== "offline" && (
            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
              <PulseTicker ahead={doctor.queueAhead} waitMins={doctor.waitMins} size="sm" tone="teal" />
            </div>
          )}

          <div className="mt-5 space-y-2">
            {doctor.modes.map((m) => (
              <label key={m} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                <span className="flex items-center gap-2">
                  <input type="radio" name="mode" defaultChecked={m === doctor.modes[0]} className="accent-teal-600" />
                  {m}
                </span>
                <span className="text-xs text-ink-soft">{m === "Online" ? "Video consult" : "At the clinic"}</span>
              </label>
            ))}
          </div>

          <Button to={`/doctors/${doctor.id}/book`} variant="primary" size="lg" className="mt-5 w-full">
            Book &middot; next slot {doctor.nextSlot}
          </Button>
          <p className="mt-3 text-center text-xs text-ink-soft/70">
            Free cancellation up to 2 hours before your slot.
          </p>
        </aside>
      </div>
    </div>
  );
}
