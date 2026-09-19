import { Link } from "react-router-dom";
import { ShieldCheck, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 dark:border-stone-800 bg-stone-100/50 dark:bg-[#141312] transition-colors text-stone-600 dark:text-stone-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="font-serif text-lg text-stone-900 dark:text-stone-100">
              Reasons to Live
            </span>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              A quiet, anonymous sanctuary for anyone walking through heavy days. Read honest words of survival and remember that you are not alone in the quiet. 
            </p>
            
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-stone-500" />
              <span>100% Anonymous &middot; No accounts &middot; No tracking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold">
              Archive
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/wall" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  Letters of Hope
                </Link>
              </li>
              <li>
                <Link to="/reasons" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  Little Reasons to Live
                </Link>
              </li>
              <li>
                <Link to="/share" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  Write a Letter
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  Crisis Support & Helplines
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Crisis Contact */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold">
              India Crisis Helplines
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="text-stone-700 dark:text-stone-300">Tele-MANAS (24/7):</span>
                <a href="tel:14416" className="text-stone-900 dark:text-stone-100 underline hover:opacity-80">
                  14416 / 1800-891-4416
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="text-stone-700 dark:text-stone-300">Vandrevala Fdn:</span>
                <a href="tel:+919999666555" className="text-stone-900 dark:text-stone-100 underline hover:opacity-80">
                  +91 9999 666 555
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="text-stone-700 dark:text-stone-300">KIRAN (Govt):</span>
                <a href="tel:18005990019" className="text-stone-900 dark:text-stone-100 underline hover:opacity-80">
                  1800-599-0019
                </a>
              </li>
              <li className="pt-1">
                <Link
                  to="/support"
                  className="text-stone-700 dark:text-stone-300 underline text-[11px]"
                >
                  View full support directory &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical & Crisis Disclaimer */}
        <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800 text-[11px] leading-relaxed text-stone-400 dark:text-stone-500 space-y-2">
          <p>
            <strong>Safety Note:</strong> Reasons to Live is a peer-supported space for emotional solidarity and mutual comfort. It is not a clinical medical service or crisis intervention team. If you are in immediate danger, please reach out to emergency services (dial 112 in India) or call Tele-MANAS at 14416.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Reasons to Live. You are worthy of being here tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
