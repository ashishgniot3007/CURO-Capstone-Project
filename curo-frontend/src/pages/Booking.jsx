import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import {
  getProvider,
  getSlots,
  createBooking,
  getBooking,
  mockPaymentSuccess,
  mockPaymentFail,
} from "../lib/api";

const STEPS = ["Slot", "Review", "Payment", "Confirmed"];

function formatSlotString(startTime) {
  const date = new Date(startTime);
  const dateStr = date.toLocaleDateString([], { day: "numeric", month: "short" });
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dateStr}, ${timeStr}`;
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const [step, setStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      setBookingError("");
      try {
        const [prov, slotList] = await Promise.all([
          getProvider(id),
          getSlots(id, {
            from: new Date().toISOString(),
            to: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        ]);
        if (active) {
          setDoctor(prov);
          setSlots(slotList);
        }
      } catch (err) {
        if (active) {
          setBookingError(err.message || "Failed to load booking details");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container-page py-14 text-center text-ink-soft">Loading booking flow...</div>;
  }

  if (!doctor) {
    return <Navigate to="/doctors" replace />;
  }

  const isLast = step === STEPS.length - 1;
  const availableSlots = slots.filter((s) => s.status === "AVAILABLE");

  async function handleContinue() {
    setBookingError("");
    if (step === 0) {
      if (!selectedSlot) {
        setBookingError("Please choose a time slot to continue.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      setApiLoading(true);
      try {
        const idempotencyKey = crypto.randomUUID();
        const res = await createBooking({
          slotId: selectedSlot.id,
          idempotencyKey,
        });
        setBookingId(res.bookingId);
        setPaymentUrl(res.paymentUrl || "");
        setStep(2);
      } catch (err) {
        setBookingError(err.message || "This slot is already booked or taken. Please select another slot.");
        setStep(0);
        setSelectedSlot(null);
        // Refresh slot list
        try {
          const freshSlots = await getSlots(id, {
            from: new Date().toISOString(),
            to: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          });
          setSlots(freshSlots);
        } catch (e) {
          console.error("Failed to refresh slots:", e);
        }
      } finally {
        setApiLoading(false);
      }
    }
  }

  async function handlePay() {
    if (!bookingId) return;
    setApiLoading(true);
    setBookingError("");
    try {
      await mockPaymentSuccess(bookingId);
      const verifiedBooking = await getBooking(bookingId);
      if (verifiedBooking.status === "CONFIRMED") {
        setStep(3);
      } else {
        throw new Error(`Booking status is ${verifiedBooking.status}, expected CONFIRMED.`);
      }
    } catch (err) {
      setBookingError(err.message || "Payment confirmation failed. Please try again.");
    } finally {
      setApiLoading(false);
    }
  }

  async function handleSimulateFail() {
    if (!bookingId) return;
    setApiLoading(true);
    setBookingError("");
    try {
      await mockPaymentFail(bookingId);
      setBookingError("Payment simulated failure. Booking cancelled and slot released.");
      setTimeout(() => {
        setStep(0);
        setSelectedSlot(null);
      }, 2000);
    } catch (err) {
      setBookingError(err.message || "Failed to cancel booking");
      setApiLoading(false);
    }
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
        {bookingError && (
          <div className="mb-6 rounded-lg border border-pulse-soft bg-pulse-dim p-3.5 text-sm font-medium text-pulse animate-shake">
            {bookingError}
          </div>
        )}

        {step === 0 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Choose an available slot</h1>
            <p className="mt-1 text-sm text-ink-soft">with {doctor.name} ({doctor.speciality})</p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableSlots.length > 0 ? (
                availableSlots.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSlot(s)}
                    className={`rounded-lg border px-3 py-2.5 font-mono text-sm font-medium transition-all ${
                      selectedSlot?.id === s.id
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-line text-ink-soft hover:border-teal-300"
                    }`}
                  >
                    {formatSlotString(s.startTime)}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-6 text-center text-sm text-ink-soft">
                  No slots currently available. Please check back later.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Review booking details</h1>
            <p className="mt-1 text-sm text-ink-soft">Please review the details below before creating the booking.</p>
            <div className="mt-6 rounded-xl border border-line bg-paper-dim p-5 space-y-3">
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-xs font-semibold text-ink-soft">Provider</span>
                <span className="text-sm font-medium text-ink">{doctor.name} ({doctor.speciality})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-ink-soft">Selected Slot</span>
                <span className="text-sm font-mono text-ink">{formatSlotString(selectedSlot.startTime)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Payment Gateway</h1>
            <p className="mt-1 text-sm text-ink-soft">A simulated interface to process payment.</p>

            {paymentUrl && (
              <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-lg text-xs text-teal-700 font-mono">
                Payment Link: <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{paymentUrl}</a>
              </div>
            )}

            <div className="mt-6 space-y-2">
              {["UPI", "Card", "Net banking"].map((p, i) => (
                <label key={p} className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                  <input type="radio" name="pay" defaultChecked={i === 0} className="accent-teal-600" />
                  {p}
                </label>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleSimulateFail}
                disabled={apiLoading}
                className="text-xs text-pulse hover:underline font-medium"
              >
                [Dev Only] Simulate Failed Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-600">
              &#10003;
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Appointment Confirmed</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              Your appointment with {doctor.name} is successfully scheduled for {selectedSlot ? formatSlotString(selectedSlot.startTime) : ""}.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" size="md" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}

        {!isLast && (
          <div className="mt-8 flex justify-end border-t border-line pt-6">
            <Button
              as="button"
              variant="primary"
              size="md"
              disabled={apiLoading}
              onClick={step === 2 ? handlePay : handleContinue}
            >
              {apiLoading ? "Processing..." : step === 2 ? "Simulate Payment" : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
