import { Link } from "react-router-dom";
import StatusDot from "./StatusDot";

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group block rounded-xl2 border border-line bg-white p-5 transition-all duration-150 hover:shadow-card hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 font-display text-lg font-semibold text-teal-700">
          {doctor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-teal-600">
                {doctor.name}
              </h3>
              <p className="text-sm text-ink-soft">{doctor.speciality} &middot; {doctor.experience} yrs</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-sm font-semibold text-ink">{"\u20b9"}{doctor.fee}</div>
              <div className="text-[11px] text-ink-soft/70">per visit</div>
            </div>
          </div>

          <p className="mt-2 text-sm text-ink-soft">{doctor.hospital} &middot; {doctor.locality}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusDot status={doctor.status} />
            <span className="text-xs text-ink-soft">
              &#9733; {doctor.rating} <span className="text-ink-soft/60">({doctor.reviews})</span>
            </span>
            <div className="flex gap-1.5">
              {doctor.modes.map((m) => (
                <span key={m} className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="font-mono text-xs text-ink-soft">
          Next slot &middot; <span className="font-medium text-ink">{doctor.nextSlot}</span>
        </div>
        {doctor.status !== "offline" && (
          <div className="font-mono text-xs text-teal-600">
            {doctor.queueAhead} ahead &middot; ~{doctor.waitMins}m wait
          </div>
        )}
      </div>
    </Link>
  );
}
