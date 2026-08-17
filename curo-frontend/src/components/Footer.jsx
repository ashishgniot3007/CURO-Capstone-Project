import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M0 11 H7 L9.5 3 L13.5 19 L16 11 H22" stroke="#0F5C56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-lg font-semibold text-ink">curo</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              One place to find a doctor, book online or in person, and know exactly how long the wait is before you leave home.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-3">Patients</div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link to="/doctors" className="hover:text-teal-600">Find a doctor</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-600">My appointments</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-600">Medical records</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3">Providers</div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><a href="#" className="hover:text-teal-600">List your practice</a></li>
              <li><a href="#" className="hover:text-teal-600">Doctor dashboard</a></li>
              <li><a href="#" className="hover:text-teal-600">Hospital admin</a></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3">Company</div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><a href="#" className="hover:text-teal-600">About CURO</a></li>
              <li><a href="#" className="hover:text-teal-600">Privacy</a></li>
              <li><a href="#" className="hover:text-teal-600">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft/70 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; 2026 CURO Health Technologies. For demonstration purposes.</span>
          <span>Not a substitute for emergency medical services. In an emergency, call your local emergency number.</span>
        </div>
      </div>
    </footer>
  );
}
