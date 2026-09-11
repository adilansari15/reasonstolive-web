import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenLine, Shuffle, Sparkles, Heart, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "../services/api.js";
import { formatTimeAgo } from "../utils/constants.js";

export function HeroSection({ initialLetter, stats }) {
  const [currentLetter, setCurrentLetter] = useState(initialLetter || null);
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [hasHearted, setHasHearted] = useState(false);
  const [hasHelped, setHasHelped] = useState(false);

  useEffect(() => {
    if (initialLetter && !currentLetter) {
      setCurrentLetter(initialLetter);
    }
  }, [initialLetter]);

  const handleReadAnother = async () => {
    setLoadingLetter(true);
    setHasHearted(false);
    setHasHelped(false);
    try {
      const random = await api.getRandomPost();
      setCurrentLetter(random);
    } catch (err) {
      console.warn("Using fallback random letter:", err);
    } finally {
      setTimeout(() => setLoadingLetter(false), 200);
    }
  };

  const handleHeart = async () => {
    if (!currentLetter || hasHearted) return;
    setHasHearted(true);
    setCurrentLetter((prev) => ({ ...prev, heartCount: (prev?.heartCount || 0) + 1 }));
    try {
      await api.reactToPost(currentLetter._id, "heart");
    } catch (e) {
      console.error(e);
    }
  };

  const handleHelpful = async () => {
    if (!currentLetter || hasHelped) return;
    setHasHelped(true);
    setCurrentLetter((prev) => ({ ...prev, helpfulCount: (prev?.helpfulCount || 0) + 1 }));
    try {
      await api.reactToPost(currentLetter._id, "helpful");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-10">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-850 px-3 py-1 rounded-full border border-stone-200/80 dark:border-stone-800">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
          <span>Anonymous &middot; Free &middot; No sign-up required</span>
        </div>

        {/* Calm Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-[1.25]">
            Letters of hope, connection, and reasons to stay.
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-normal leading-relaxed max-w-2xl mx-auto">
            A quiet sanctuary where strangers leave honest words for anyone who is exhausted, hurting, or wondering if tomorrow is worth the fight.
          </p>
        </div>

        {/* Featured Letter Spotlight - Styled like a genuine letter on stationery */}
        <div className="max-w-2xl mx-auto text-left">
          <div className="relative rounded-2xl bg-white dark:bg-[#1B1A18] border border-stone-200 dark:border-stone-800/90 p-6 sm:p-9 shadow-sm transition-all">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3.5 mb-5 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium tracking-wide uppercase text-[11px] text-stone-400 dark:text-stone-500">
                A Letter For Whoever Needs It Today
              </span>
              {currentLetter?.createdAt && (
                <span>{formatTimeAgo(currentLetter.createdAt)}</span>
              )}
            </div>

            {/* Letter Content */}
            <div className={`min-h-[140px] flex items-center transition-opacity duration-200 ${loadingLetter ? "opacity-30" : "opacity-100"}`}>
              {currentLetter ? (
                <p className="font-serif text-lg sm:text-xl text-stone-800 dark:text-stone-200 leading-relaxed italic whitespace-pre-wrap">
                  &ldquo;{currentLetter.content}&rdquo;
                </p>
              ) : (
                <p className="text-stone-400 italic">Finding a letter of hope for you...</p>
              )}
            </div>

            {/* Letter Footer: Tags, Reactions, & Shuffle */}
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleHelpful}
                  disabled={hasHelped}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    hasHelped
                      ? "border-stone-400 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                      : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850"
                  }`}
                  title="This comforted me"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${hasHelped ? "text-amber-600 dark:text-amber-300" : "text-stone-400"}`} />
                  <span>This helped me</span>
                  <span className="text-stone-400 font-normal">({currentLetter?.helpfulCount || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={handleHeart}
                  disabled={hasHearted}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    hasHearted
                      ? "border-stone-400 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                      : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850"
                  }`}
                  title="Holding on with you"
                >
                  <Heart className={`w-3.5 h-3.5 ${hasHearted ? "text-rose-600 fill-rose-600" : "text-stone-400"}`} />
                  <span>Holding on</span>
                  <span className="text-stone-400 font-normal">({currentLetter?.heartCount || 0})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReadAnother}
                disabled={loadingLetter}
                className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 underline decoration-stone-300 hover:decoration-stone-900 transition-colors py-1"
              >
                <Shuffle className={`w-3.5 h-3.5 ${loadingLetter ? "animate-spin" : ""}`} />
                <span>Read another letter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Soulful Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto pt-2">
          <Link
            to="/wall"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-all text-sm"
            id="hero-read-all-letters-btn"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read All Letters</span>
          </Link>

          <Link
            to="/share"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-[#1E1D1B] border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-[0.98] transition-all text-sm"
            id="hero-write-letter-btn"
          >
            <PenLine className="w-4 h-4" />
            <span>Write a Letter</span>
          </Link>
        </div>

        {/* Quiet Community Count */}
        {stats && (
          <p className="text-xs text-stone-500 dark:text-stone-500 pt-2">
            Over {stats.totalPosts} letters of survival shared &middot; {stats.totalReasons} reasons to stay recorded
          </p>
        )}
      </div>
    </section>
  );
}
