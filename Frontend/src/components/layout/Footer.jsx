import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gold">
              <Home className="h-4 w-4 text-navy" />
            </div>
            <span className="font-serif text-lg font-bold">
              Home<span className="text-gold">Trust</span>
            </span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Free neighborhood intelligence and scam-free verified rental
            listings. Built for renters, brokers and institutional researchers.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/report/search" className="hover:text-gold">
                Reports
              </Link>
            </li>
            <li>
              <Link to="/listings/browse" className="hover:text-gold">
                Rentals
              </Link>
            </li>
            <li>
              <Link to="/report/compare" className="hover:text-gold">
                Compare
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/about#contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/about#privacy" className="hover:text-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/about#terms" className="hover:text-gold">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 md:flex-row md:px-6">
          <span>
            © {new Date().getFullYear()} HomeTrust. All rights reserved.
          </span>
          <span>Institutional Grade Data · AI Scam Detection</span>
        </div>
      </div>
    </footer>
  );
}
