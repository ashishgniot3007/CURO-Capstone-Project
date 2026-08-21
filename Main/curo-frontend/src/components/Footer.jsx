import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold text-teal-700">curo</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              One place to find a provider, book appointments online or in person, and manage your health visits.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-3">Patients</div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link to="/doctors" className="hover:text-teal-600">Find a provider</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-600">My appointments</Link></li>
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
