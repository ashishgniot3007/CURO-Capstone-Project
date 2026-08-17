import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import StatusDot from "../components/StatusDot";
import { doctors } from "../data/mock";

export default function Queue() {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id) || doctors[0];

  const [ahead, setAhead] = useState(doctor.queueAhead || 3);
  const [waitMins, setWaitMins] = useState(doctor.waitMins || 22);

  useEffect(() => {
    const interval = setInterval(() => {
      // every ~14s, simulate the queue moving forward by one patient
      setAhead((a) => (a > 0 ? a - (Math.random() > 0.55 ? 1 : 0) : 0));
      setWaitMins((w) => Math.max(0, w - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isYourTurn = ahead === 0 && waitMins <= 2;

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      <span className="eyebrow">Live &middot; updates automatically</span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
        {isYourTurn ? "You're up next" : "Your place in the queue"}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{doctor.name} &middot; {doctor.hospital}</p>

      <div className={`mt-8 rounded-xl2 border p-8 text-center transition-colors ${
        isYourTurn ? "border-pulse bg-pulse-dim" : "border-teal-100 bg-teal-50"
      }`}>
        <div className="flex items-center justify-center gap-2">
          <StatusDot status={isYourTurn ? "busy" : "available"} showLabel={false} />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
            {isYourTurn ? "Please head to reception" : "Token being served: #14"}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-10">
          <div>
            <div className={`font-mono text-6xl font-semibold leading-none ${isYourTurn ? "text-pulse" : "text-ink"}`}>
              {ahead}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-soft/70">patients ahead</div>
          </div>
          <div className="h-16 w-px bg-line" />
          <div>
            <div className={`font-mono text-6xl font-semibold leading-none ${isYourTurn ? "text-pulse" : "text-ink"}`}>
              {waitMins}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-soft/70">minutes, est.</div>
          </div>
        </div>

        <svg width="100%" height="36" viewBox="0 0 320 36" className="mx-auto mt-6 max-w-xs" aria-hidden="true">
          <path
            d="M0 18 H60 L72 6 L88 32 L102 18 H140 L150 10 L162 26 L172 18 H320"
            stroke={isYourTurn ? "#E8604C" : "#0F5C56"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="240"
            className="animate-pulseline"
          />
        </svg>
      </div>

      <div className="mt-6 rounded-xl2 border border-line bg-white p-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">What happens next</h2>
        <ul className="mt-3 space-y-3 text-sm text-ink-soft">
          <li className="flex gap-3">
            <span className="mt-0.5 text-teal-500">&#8226;</span>
            We'll send a reminder when there are 2 patients left ahead of you.
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-teal-500">&#8226;</span>
            Running late? Let the clinic know from your dashboard and keep your slot.
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-teal-500">&#8226;</span>
            Once seen, your prescription and notes are added to your CURO record automatically.
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button to="/dashboard" variant="secondary" size="md">Back to dashboard</Button>
        <Button as="button" variant="ghost" size="md">Notify the clinic I'm running late</Button>
      </div>
    </div>
  );
}
