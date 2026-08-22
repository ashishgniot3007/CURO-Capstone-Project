import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import { specialities } from "../data/mock";
import { getProviders } from "../lib/api";

export default function Search() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [spec, setSpec] = useState(params.get("spec") || "All");
  const [sort, setSort] = useState("rating");

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.log("Geolocation error:", err)
      );
    }
  }, []);

  // Fetch providers from backend when speciality or coords change
  useEffect(() => {
    let active = true;
    async function fetchProviders() {
      setLoading(true);
      setError(null);
      try {
        const specParam = spec === "All" ? undefined : spec;
        const data = await getProviders({
          speciality: specParam,
          lat: coords?.lat,
          lng: coords?.lng,
        });
        if (active) {
          setProviders(data);
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
    fetchProviders();
    return () => {
      active = false;
    };
  }, [spec, coords]);

  const filtered = useMemo(() => {
    let list = providers.filter((d) => {
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.speciality.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });

    if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [providers, query, sort]);

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
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft outline-none focus-visible:border-teal-400"
        >
          <option value="rating">Highest rated</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-ink-soft">Loading providers...</div>
      ) : error ? (
        <div className="mt-16 text-center text-pulse font-medium">{error}</div>
      ) : filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-lg font-semibold text-ink">No doctors match those filters</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Try a broader speciality or search term.
          </p>
        </div>
      )}
    </div>
  );
}
