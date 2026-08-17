import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import { doctors } from "../data/mock";

const STEPS = ["Slot", "Details", "Payment", "Confirmed"];

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find((d) => d.id === id);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState(doctor?.modes[0]);
  const [slot, setSlot] = useState("4:40 PM");

  if (!doctor) return <Navigate to="/doctors" replace />;

  const isLast = step === STEPS.length - 1;

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      {/* Step indicator */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                i <= step ? "bg-teal-500 text-white" : "bg-teal-50 text-ink-soft"
              }`}
            >
              {i < step ? "\u2713" : i + 1}
            </div>
            <span className={`hidden text-xs font-medium sm:inline ${i <= step ? "text-ink" : "text-ink-soft/60"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-teal-500" : "bg-line"}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl2 border border-line bg-white p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Choose a slot</h1>
            <p className="mt-1 text-sm text-ink-soft">with {doctor.name}, {doctor.speciality}</p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {["2:30 PM", "3:00 PM", "3:45 PM", "4:40 PM", "5:15 PM", "6:00 PM"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`rounded-lg border px-3 py-2.5 font-mono text-sm font-medium ${
                    slot === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-line text-ink-soft hover:border-teal-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {doctor.modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                    mode === m ? "border-teal-500 bg-teal-50 text-teal-700" : "border-line text-ink-soft"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Patient details</h1>
            <p className="mt-1 text-sm text-ink-soft">This is who the appointment is for.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" placeholder="As per ID" />
              <Field label="Phone number" placeholder="+91 9XXXXXXXXX" />
              <Field label="Age" placeholder="32" />
              <Field label="Reason for visit" placeholder="e.g. Follow-up, chest pain" full />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Payment</h1>
            <p className="mt-1 text-sm text-ink-soft">Confirms your slot and holds your place in the queue.</p>
            <div className="mt-6 rounded-xl border border-line bg-paper-dim p-4">
              <Row label="Consultation fee" value={`\u20b9${doctor.fee}`} />
              <Row label="Platform fee" value="\u20b920" />
              <Row label="Total" value={`\u20b9${doctor.fee + 20}`} bold />
            </div>
            <div className="mt-6 space-y-2">
              {["UPI", "Card", "Net banking"].map((p, i) => (
                <label key={p} className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                  <input type="radio" name="pay" defaultChecked={i === 0} className="accent-teal-600" />
                  {p}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-600">
              &#10003;
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Appointment confirmed</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              {doctor.name} &middot; {mode} &middot; {slot} today. We'll remind you before it's your turn.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" size="md" onClick={() => navigate(`/queue/${doctor.id}`)}>
                Track live queue
              </Button>
              <Button variant="secondary" size="md" onClick={() => navigate("/dashboard")}>
                Go to dashboard
              </Button>
            </div>
          </div>
        )}

        {!isLast && (
          <div className="mt-8 flex justify-end border-t border-line pt-6">
            <Button variant="primary" size="md" onClick={next}>
              {step === 2 ? `Pay \u20b9${doctor.fee + 20}` : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, placeholder, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus-visible:border-teal-400"
      />
    </label>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between py-1.5 text-sm ${bold ? "font-semibold text-ink" : "text-ink-soft"}`}>
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
