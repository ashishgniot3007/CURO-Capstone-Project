import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";

const LINKS = [
  { to: "/doctors", label: "Find a doctor" },
  { to: "/queue-demo", label: "Live queue" },
  { to: "/dashboard", label: "My health" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M0 11 H7 L9.5 3 L13.5 19 L16 11 H22" stroke="#0F5C56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">curo</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-teal-600" : "text-ink-soft hover:text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button to="/login" variant="ghost" size="sm">Log in</Button>
          <Button to="/doctors" variant="primary" size="sm">Book a visit</Button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1">
            <span className="block h-[1.5px] w-4 bg-ink" />
            <span className="block h-[1.5px] w-4 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-teal-50 hover:text-teal-700"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 px-2 pb-2">
              <Button to="/login" variant="secondary" size="sm" className="flex-1">Log in</Button>
              <Button to="/doctors" variant="primary" size="sm" className="flex-1">Book a visit</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
