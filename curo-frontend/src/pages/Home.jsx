import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import DoctorCard from "../components/DoctorCard";
import PulseTicker from "../components/PulseTicker";
import StatusDot from "../components/StatusDot";
import { doctors, specialities } from "../data/mock";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/doctors?q=${encodeURIComponent(query)}` : "/doctors");
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <span className="eyebrow">Doctor &amp; hospital booking, without the guessing</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Know your wait
              <br />
              before you leave home.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              CURO books your online or in-clinic appointment, then shows you the actual
              queue ahead of you &mdash; in real time &mdash; so you arrive right when it's your turn.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-lg items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 shadow-card">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-soft/60">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by speciality, doctor, or clinic"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/50"
              />
              <Button as="button" type="submit" variant="primary" size="md">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {specialities.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(`/doctors?spec=${encodeURIComponent(s)}`)}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-teal-400 hover:text-teal-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Signature: live queue preview card */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-sm rounded-xl2 border border-line bg-white p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Live at Sunrise Heart Institute</span>
                <StatusDot status="available" showLabel={false} />
              </div>
              <div className="mt-5">
                <PulseTicker ahead={3} waitMins={22} size="lg" />
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-display text-sm font-semibold text-teal-700">
                  AR
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">Dr. Anjali Rao</div>
                  <div className="text-xs text-ink-soft">Cardiology &middot; Token #14 called</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden w-48 rounded-xl2 border border-line bg-white p-4 shadow-card sm:block">
              <div className="text-xs text-ink-soft">Next reminder</div>
              <div className="mt-1 font-mono text-sm font-medium text-ink">In 18 minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <span className="eyebrow">How CURO works</span>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold tracking-tight text-ink">
            Three steps between you and being seen.
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Find & choose",
                copy: "Search by speciality, location, or symptom. Compare availability, fees, and consultation mode before you pick.",
              },
              {
                title: "Book, online or in person",
                copy: "Reserve a video consult or an in-clinic slot in the same flow, and pay securely to confirm it.",
              },
              {
                title: "Track your turn",
                copy: "Watch your position in the queue update live, so you leave home at the right time, not too early.",
              },
            ].map((step, i) => (
              <div key={step.title} className="relative rounded-xl2 border border-line p-6">
                <div className="font-mono text-xs text-teal-500">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE NOW */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Available near you</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
              Doctors you can see today.
            </h2>
          </div>
          <Button to="/doctors" variant="ghost" size="sm" className="hidden sm:inline-flex">
            View all &rarr;
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.slice(0, 3).map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>

        <Button to="/doctors" variant="secondary" size="md" className="mt-8 w-full sm:hidden">
          View all doctors
        </Button>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-line bg-teal-900 text-white">
        <div className="container-page grid gap-10 py-14 sm:grid-cols-3">
          <div>
            <div className="font-mono text-3xl font-semibold">10,000+</div>
            <p className="mt-2 text-sm text-teal-100">patients served per region, with room to scale.</p>
          </div>
          <div>
            <div className="font-mono text-3xl font-semibold">&lt; 3 sec</div>
            <p className="mt-2 text-sm text-teal-100">average response time for search and booking.</p>
          </div>
          <div>
            <div className="font-mono text-3xl font-semibold">256-bit</div>
            <p className="mt-2 text-sm text-teal-100">encryption on every medical record and prescription.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-lg font-display text-3xl font-semibold tracking-tight text-ink">
          Your next appointment is a search away.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
          Create your CURO profile once, and book with any doctor or hospital on the platform after that.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button to="/signup" variant="primary" size="lg">Create your profile</Button>
          <Button to="/doctors" variant="secondary" size="lg">Browse doctors</Button>
        </div>
      </section>
    </>
  );
}
