import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, MOODS } from "../utils/constants.js";
import { PenLine, Shield, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "../services/api.js";

export function PostForm({ onSuccess }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [mood, setMood] = useState("Hopeful");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedPost, setSubmittedPost] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("SUBMIT FIRED");
    if (!content.trim() || content.trim().length < 10) {
      setError("Please write at least a sentence (10 characters) to express yourself.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newPost = await api.createPost({
        content: content.trim(),
        category,
        mood,
      });

        console.log("Post created:", newPost);

      setSubmittedPost(newPost);
      setContent("");
      if (onSuccess) onSuccess(newPost);
    } catch (err) {
      setError(err.message || "Failed to publish your letter. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedPost) {
    return (
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5">
        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-stone-100">
            Thank you for leaving your words
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
            Your letter has been placed in the archive. Somewhere right now, another person is sitting in silence and will read what you just wrote.
          </p>
        </div>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSubmittedPost(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            Write Another Letter
          </button>
          <Link
            to="/wall"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white transition-colors"
          >
            <span>Browse Letters Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-6 sm:p-9 transition-colors"
      id="share-story-form"
    >
      {/* Form Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800/80">
        <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
          <PenLine className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg text-stone-900 dark:text-stone-100">
            Write a Letter of Hope
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Completely anonymous. No account, no email, no tracking.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-800 dark:text-stone-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-stone-600 dark:text-stone-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Mood Selector */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
          How is your heart feeling today?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MOODS.map((m) => {
            const isSelected = mood === m.name;
            return (
              <button
                key={m.name}
                type="button"
                onClick={() => setMood(m.name)}
                className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col gap-0.5 ${
                  isSelected
                    ? "border-stone-900 bg-stone-100 dark:border-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                    : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-400"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{m.emoji}</span>
                  <span className="text-xs">{m.name}</span>
                </div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate">
                  {m.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
          Theme or Context
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-stone-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Letter Content */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="letter-content-textarea"
            className="block text-xs uppercase tracking-wider text-stone-500 font-semibold"
          >
            Your Letter
          </label>
          <span className="text-xs text-stone-400">
            {content.length} characters (min 10)
          </span>
        </div>
        <textarea
          id="letter-content-textarea"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Speak from the chest. Tell someone who is carrying a heavy heart what you survived, what gives you a sliver of hope, or simply leave a gentle reminder that they matter..."
          className="w-full p-4 rounded-xl font-serif bg-stone-50 dark:bg-[#151413] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 transition-colors text-[15px] sm:text-[16.5px] leading-relaxed"
        />
      </div>

      {/* Safe community commitment */}
      <div className="mb-6 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-xs text-stone-500 dark:text-stone-400 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <p>
          To maintain a safe and protective sanctuary, please do not include identifying contact details or explicit self-harm descriptions.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || content.trim().length < 10}
        className="w-full py-3 px-6 rounded-xl font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
        id="submit-story-btn"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding your letter...</span>
          </>
        ) : (
          <span>Place Letter on the Wall</span>
        )}
      </button>
    </form>
  );
}
