import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, PhoneCall, PenLine, Compass, LifeBuoy, BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Letters", href: "/wall", icon: BookOpen },
    { name: "Reasons to Stay", href: "/reasons", icon: Compass },
    { name: "Write a Letter", href: "/share", icon: PenLine },
    { name: "Crisis & Support", href: "/support", icon: LifeBuoy },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/95 dark:bg-[#141312]/95 backdrop-blur-sm transition-colors">
      {/* Calm Crisis Bar - WCAG AA accessible and clear */}
      <div className="bg-stone-900 text-stone-200 dark:bg-stone-950 dark:text-stone-300 text-xs px-4 py-2 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-medium truncate">
              In deep pain or need someone to talk to right now?
            </span>
          </div>
          {/* <div className="flex items-center gap-2.5 shrink-0 text-xs">
            <a
              href="tel:14416"
              className="font-semibold text-amber-200 hover:text-white underline decoration-amber-300/50 transition-colors"
            >
              Tele-MANAS: Call 14416 (India 24/7)
            </a>
            <span className="text-stone-500 hidden sm:inline">&middot;</span>
            <a
              href="tel:+919999666555"
              className="font-medium text-stone-300 hover:text-white underline decoration-stone-500 hidden md:inline"
            >
              Vandrevala: +91 9999 666 555
            </a>
            <span className="text-stone-500 hidden sm:inline">&middot;</span>
            <Link
              to="/support"
              className="text-stone-300 hover:text-white underline decoration-stone-500 hidden sm:inline"
            >
              All Helplines
            </Link>
          </div> */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo - Minimal & Editorial */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-lg py-1"
            id="brand-logo-link"
          >
            <div className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 transition-colors group-hover:border-stone-900 dark:group-hover:border-stone-100">
              <Heart className="w-4 h-4 fill-stone-400/30" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100">
                Reasons to Stay
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-500 dark:text-stone-400 -mt-0.5">
                Anonymous Letters of Hope
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "text-stone-900 dark:text-stone-100 font-semibold bg-stone-200/60 dark:bg-stone-800/60"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/share"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-all shadow-xs"
              id="header-share-btn"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write a Letter</span>
            </Link>

            <ThemeToggle id="nav-theme-toggle" />

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141312] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Home
            </Link>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                    active
                      ? "bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 font-semibold"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <Link
              to="/share"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-stone-50 bg-stone-900 dark:bg-stone-100 dark:text-stone-900 font-medium text-sm"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Letter of Hope</span>
            </Link>

            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Free 24/7 Crisis Support Resources</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
