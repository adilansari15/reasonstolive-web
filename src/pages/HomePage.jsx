import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { ReasonCard } from "../components/ReasonCard.jsx";
import { api } from "../services/api.js";
import { PenLine, ArrowRight, Heart, LifeBuoy, Sparkles } from "lucide-react";

export function HomePage() {
  const [featuredLetter, setFeaturedLetter] = useState(null);
  const [recentLetters, setRecentLetters] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [randomRes, postsRes, reasonsRes, statsRes] = await Promise.all([
          api.getRandomPost().catch(() => null),
          api.getPosts({ limit: 4, sort: "latest" }),
          api.getReasons(),
          api.getStats().catch(() => null),
        ]);

        if (randomRes) {
          setFeaturedLetter(randomRes);
        } else if (postsRes.posts && postsRes.posts.length > 0) {
          setFeaturedLetter(postsRes.posts[0]);
        }

        setRecentLetters(postsRes.posts || []);
        setReasons((reasonsRes || []).slice(0, 3));
        if (statsRes) setStats(statsRes);
      } catch (err) {
        console.error("Error loading home page content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero with Random Letter Spotlight */}
      <HeroSection initialLetter={featuredLetter} stats={stats} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* 2. Gentle Manifesto / Why This Exists */}
        <section className="text-center max-w-2xl mx-auto space-y-4 pt-4">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Our Purpose
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
            A reminder that you are not alone in the dark.
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
            When emotional distress peaks, our minds tell us that the pain is permanent and that no one understands. This project exists to gently break that silence. Every letter here was written by someone who stood where you are now, breathed through the night, and found a reason to stay.
          </p>
        </section>

        {/* 3. Recent Letters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                Recent Anonymous Letters
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Unfiltered reflections, struggles, and words of encouragement.
              </p>
            </div>
            <Link
              to="/wall"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-200 hover:underline underline-offset-4 self-start sm:self-auto"
            >
              <span>Read all letters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="h-56 rounded-xl bg-stone-150 dark:bg-stone-850 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentLetters.slice(0, 4).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Little Reasons to Stay */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                Little Reasons to Stay
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Simple sensory anchors and tiny moments worth sticking around for.
              </p>
            </div>
            <Link
              to="/reasons"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-200 hover:underline underline-offset-4 self-start sm:self-auto"
            >
              <span>Explore full library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reasons.map((reason) => (
              <ReasonCard key={reason._id} reason={reason} />
            ))}
          </div>
        </section>

        {/* 5. Minimal Invitation to Write */}
        <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1B1A18] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-700 dark:text-stone-300">
            <PenLine className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
            Write a letter to a stranger.
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-lg mx-auto">
            You don't have to be a poet or a therapist. Simply tell someone who feels like giving up what you needed to hear when you were hurting.
          </p>
          <div className="pt-2">
            <Link
              to="/share"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-sm active:scale-[0.98] transition-all"
            >
              <span>Submit a Letter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 6. Dignified Crisis Lifeline Card */}
        <section className="rounded-2xl border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100">
                Are you in immediate crisis?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-md leading-relaxed">
                Free, confidential support is open 24 hours a day. You do not have to carry unbearable weight alone.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:14416"
              className="px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Call 14416 (Tele-MANAS)
            </a>
            <a
              href="tel:+919999666555"
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium text-xs sm:text-sm hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            >
              Vandrevala: +91 9999 666 555
            </a>
            <Link
              to="/support"
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-medium text-xs sm:text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              All Helplines
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
