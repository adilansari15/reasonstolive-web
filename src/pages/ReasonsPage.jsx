import { useState, useEffect } from "react";
import { ReasonCard } from "../components/ReasonCard.jsx";
import { REASON_CATEGORIES } from "../utils/constants.js";
import { api } from "../services/api.js";
import { Shuffle, Plus, Heart, Loader2, CheckCircle2, X } from "lucide-react";

export function ReasonsPage() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [randomReason, setRandomReason] = useState(null);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reason Form state
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("Simple Pleasures");
  const [newAuthor, setNewAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchReasons = async () => {
    setLoading(true);
    try {
      const data = await api.getReasons({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      });
      setReasons(data);
      if (!randomReason && data.length > 0) {
        setRandomReason(data[Math.floor(Math.random() * data.length)]);
      }
    } catch (err) {
      console.error("Failed to load reasons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, [selectedCategory]);

  const handleDrawRandom = async () => {
    setLoadingRandom(true);
    try {
      const random = await api.getRandomReason();
      setRandomReason(random);
    } catch {
      if (reasons.length > 0) {
        const rand = reasons[Math.floor(Math.random() * reasons.length)];
        setRandomReason(rand);
      }
    } finally {
      setTimeout(() => setLoadingRandom(false), 200);
    }
  };

  const handleCreateReason = async (e) => {
    e.preventDefault();
    if (!newText.trim() || newText.trim().length < 3) {
      setSubmitError("Please write at least a few words describing your reason.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const created = await api.createReason({
        text: newText.trim(),
        category: newCategory,
        author: newAuthor.trim() || "Anonymous",
      });

      setReasons((prev) => [created, ...prev]);
      setSubmitSuccess(true);
      setNewText("");
      setNewAuthor("");
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddModal(false);
      }, 1400);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit reason");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            The Living Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal mt-1">
            Little Reasons to Stay
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            A quiet collection of simple pleasures, sensory anchors, future memories, and tiny moments worth sticking around for.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-all self-start sm:self-auto"
          id="add-reason-modal-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add a Reason</span>
        </button>
      </div>

      {/* Random Reason Spotlight Card - Warm Paper Stationery */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-7 sm:p-12 text-center space-y-6">
        <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-medium">
          A Reason For You Right Now
        </span>

        <div className="min-h-[100px] flex items-center justify-center max-w-2xl mx-auto">
          {randomReason ? (
            <div
              className={`transition-opacity duration-200 ${
                loadingRandom ? "opacity-30" : "opacity-100"
              }`}
            >
              <p className="font-serif text-xl sm:text-3xl font-normal leading-relaxed text-stone-900 dark:text-stone-100 italic">
                &ldquo;{randomReason.text}&rdquo;
              </p>
              <div className="mt-3 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-2">
                <span>&mdash; {randomReason.author}</span>
                <span>&middot;</span>
                <span className="text-stone-400">
                  {randomReason.category}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-stone-400 italic">Drawing a gentle reason...</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleDrawRandom}
            disabled={loadingRandom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Shuffle className={`w-3.5 h-3.5 ${loadingRandom ? "animate-spin" : ""}`} />
            <span>Draw Another Reason</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {REASON_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900"
                  : "bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Community Reasons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 animate-pulse p-5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map((reason) => (
            <ReasonCard
              key={reason._id}
              reason={reason}
              onLike={(updated) => {
                setReasons((prev) =>
                  prev.map((r) => (r._id === updated._id ? updated : r))
                );
              }}
            />
          ))}
        </div>
      )}

      {/* Add Reason Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                Add a Reason to Stay
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base text-stone-900 dark:text-stone-100">
                  Reason Added
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Thank you for placing a gentle reminder into the archive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReason} className="space-y-4">
                {submitError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{submitError}</p>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                    What is a reason to hold on? (Big or tiny)
                  </label>
                  <textarea
                    rows={3}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="e.g., Cold water after a hot walk, your dog waiting by the door, hearing a song you haven't discovered yet, fresh coffee..."
                    className="w-full p-3 rounded-xl font-serif bg-stone-50 dark:bg-[#151413] border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-stone-50 dark:bg-[#151413] border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-400"
                    >
                      {REASON_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                      Your Sign-off (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g., Anonymous, Reader, etc."
                      className="w-full p-2.5 rounded-lg bg-stone-50 dark:bg-[#151413] border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || newText.trim().length < 3}
                    className="w-full py-2.5 rounded-lg font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.99] disabled:opacity-40 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save to Library</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
