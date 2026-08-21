import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const initials = doctor.name
    ? doctor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "Dr";

  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group block rounded-xl2 border border-line bg-white p-5 transition-all duration-150 hover:shadow-card hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 font-display text-lg font-semibold text-teal-700">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-teal-600">
                {doctor.name}
              </h3>
              <p className="text-sm text-ink-soft">{doctor.speciality}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700">
                {doctor.type}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3">
            <span className="text-xs text-ink-soft">
              &#9733; {doctor.rating} <span className="text-ink-soft/60">({doctor.reviewsCount || 0} reviews)</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
