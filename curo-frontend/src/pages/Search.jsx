import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import { doctors, specialities } from "../data/mock";

const MODES = ["Online", "In-clinic"];

export default function Search() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [spec, setSpec] = useState(params.get("spec") || "All");
  const [mode, setMode] = useState("All");
  const [sort, setSort] = useState("wait");

  const filtered = useMemo(() => {
    let list = doctors.filter((d) => {
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.speciality.toLowerCase().includes(query.toLowerCase()) ||
        d.hospital.toLowerCase().includes(query.toLowerCase());
      const matchesSpec = spec === "All" || d.speciality === spec;
      const matchesMode = mode === "All" || d.modes.includes(mode);
      return matchesQuery && matchesSpec && matchesMode;
    });

    if (sort === "wait") list = [...list].sort((a, b) => a.waitMins - b.waitMins);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "fee") list = [...list].sort((a, b) => a.fee - b.fee);

    return list;
  }, [query, spec, mode, sort]);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Find a doctor</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {filtered.length} {filtered.length === 1 ? "doctor" : "doctors"} match your search
        </h1>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl2 border border-line bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-line px-4 py-2.5">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-soft/60">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Doctor, speciality, or clinic"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/50"
          />
        </div>

        <select
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft outline-none focus-visible:border-teal-400"
        >
          <option value="All">All specialities</option>
          {specialities.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft outline-none focus-visible:border-teal-400"
        >
          <option value="All">Online or in-clinic</option>
          {MODES.map((m) => (
            <option key={m} value={m}>{m} only</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft outline-none focus-visible:border-teal-400"
        >
          <option value="wait">Shortest wait</option>
          <option value="rating">Highest rated</option>
          <option value="fee">Lowest fee</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-lg font-semibold text-ink">No doctors match those filters</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Try a broader speciality, or clear the consultation mode filter.
          </p>
        </div>
      )}
    </div>
  );
}
