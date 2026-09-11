import { PostForm } from "../components/PostForm.jsx";
import { ShieldCheck, Heart, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";

export function SharePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
          Write an Anonymous Letter
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
          Speak to someone who needs to hear it today.
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Whether you are in the middle of a struggle or on the other side of it, your honest words can be the quiet comfort a stranger needs to make it through tonight.
        </p>
      </div>

      {/* Gentle Reassurance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
          <div>
            <h4 className="font-medium text-stone-800 dark:text-stone-200">100% Anonymous</h4>
            <p className="text-stone-400">Zero accounts, cookies, or tracking.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-stone-500 shrink-0" />
          <div>
            <h4 className="font-medium text-stone-800 dark:text-stone-200">Silent Solidarity</h4>
            <p className="text-stone-400">Your vulnerability validates others.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex items-center gap-2.5">
          <LifeBuoy className="w-4 h-4 text-stone-700 dark:text-stone-300 shrink-0" />
          <div>
            <h4 className="font-medium text-stone-900 dark:text-stone-100">Need immediate help?</h4>
            <a href="tel:14416" className="text-stone-700 dark:text-stone-300 underline font-semibold">
              Call Tele-MANAS: 14416
            </a>
          </div>
        </div>
      </div>

      {/* Main Post Form */}
      <PostForm />

      {/* Thoughtful Prompts */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-[#1C1B19]/50 p-6 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Quiet prompts if you're wondering what to write:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
          <li className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800/70 italic">
            &ldquo;When I was at my lowest point, what got me to the next sunrise was...&rdquo;
          </li>
          <li className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800/70 italic">
            &ldquo;Something I have never been able to admit out loud to my family is...&rdquo;
          </li>
          <li className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800/70 italic">
            &ldquo;To whoever is crying alone in their room tonight: I want to tell you...&rdquo;
          </li>
          <li className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800/70 italic">
            &ldquo;A tiny sensory reason I am glad I decided to stay is...&rdquo;
          </li>
        </ul>
      </div>
    </div>
  );
}
