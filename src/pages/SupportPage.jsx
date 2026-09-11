import { useState, useEffect } from "react";
import { SupportCard } from "../components/SupportCard.jsx";
import { CRISIS_RESOURCES, SELF_CARE_PRACTICES } from "../utils/constants.js";
import { Phone, ShieldAlert, Wind, Play, Pause } from "lucide-react";

export function SupportPage() {
  // Breathing guide state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");
  const [breathingCountdown, setBreathingCountdown] = useState(4);

  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setBreathingCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Switch phase
        if (breathingPhase === "Inhale") {
          setBreathingPhase("Hold");
          return 7;
        } else if (breathingPhase === "Hold") {
          setBreathingPhase("Exhale");
          return 8;
        } else {
          setBreathingPhase("Inhale");
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingActive, breathingPhase]);

  const toggleBreathing = () => {
    if (breathingActive) {
      setBreathingActive(false);
      setBreathingPhase("Inhale");
      setBreathingCountdown(4);
    } else {
      setBreathingActive(true);
      setBreathingPhase("Inhale");
      setBreathingCountdown(4);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
          Emergency & Crisis Resources
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
          Help is always within reach.
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          If your pain feels unbearable right now, please let someone trained and compassionate hold the space for you. You do not have to carry this alone.
        </p>
      </div>

      {/* Urgent Crisis Callout Box */}
      <div className="rounded-2xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
              In immediate danger or distress?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
              If you have active intent or fear you cannot keep yourself safe for the next hour, please reach out right away. Counselors are free, confidential, and waiting for you.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="tel:14416"
            className="px-4 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium hover:opacity-90 active:scale-[0.98] transition-all text-xs sm:text-sm"
          >
            Call Tele-MANAS: 14416
          </a>
          <a
            href="tel:+919999666555"
            className="px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-[0.98] transition-all text-xs sm:text-sm"
          >
            Vandrevala: +91 9999 666 555
          </a>
        </div>
      </div>

      {/* 1. Emergency Helplines Section */}
      <section className="space-y-6">
        <div className="border-b border-stone-200/80 dark:border-stone-800 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
            Free 24/7 Helplines
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Confidential support available at all hours by phone and text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CRISIS_RESOURCES.map((res) => (
            <SupportCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* 2. Interactive 4-7-8 Breathing Anchor */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-md mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Nervous System Anchor
          </span>
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
            The 4-7-8 Calming Breath
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Follow the gentle rhythm to signal to your nervous system that you are safe in this physical moment.
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center border transition-all duration-1000 ${
              breathingPhase === "Inhale"
                ? "scale-110 bg-stone-100 dark:bg-stone-800 border-stone-400 dark:border-stone-600"
                : breathingPhase === "Hold"
                ? "scale-105 bg-stone-150 dark:bg-stone-850 border-stone-500 dark:border-stone-500"
                : "scale-95 bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
            }`}
          >
            <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-medium mb-1">
              {breathingActive ? breathingPhase : "Ready"}
            </span>
            <span className="font-serif text-3xl text-stone-900 dark:text-stone-100">
              {breathingActive ? `${breathingCountdown}s` : "Breathe"}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
              {breathingActive
                ? breathingPhase === "Inhale"
                  ? "Inhale slowly"
                  : breathingPhase === "Hold"
                  ? "Hold breath gently"
                  : "Exhale softly"
                : "Press Start below"}
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={toggleBreathing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-colors"
          >
            {breathingActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Breathing Guide</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin 4-7-8 Breathing</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 3. Physical Grounding Practices */}
      <section className="space-y-6">
        <div className="border-b border-stone-200/80 dark:border-stone-800 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
            Grounding for Heavy Moments
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Tangible, physically soothing actions you can try right where you sit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SELF_CARE_PRACTICES.map((practice) => (
            <div
              key={practice.title}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-5 space-y-2"
            >
              <span className="text-xl">{practice.icon}</span>
              <h3 className="font-serif text-base text-stone-900 dark:text-stone-100">
                {practice.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
