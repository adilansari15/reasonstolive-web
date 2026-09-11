import { useState } from "react";
import { Heart, Check, Share2 } from "lucide-react";
import { api } from "../services/api.js";

export function ReasonCard({ reason, onLike }) {
  const [likes, setLikes] = useState(reason.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((l) => l + 1);
    setHasLiked(true);

    try {
      const updated = await api.likeReason(reason._id);
      if (onLike) onLike(updated);
    } catch {
      setLikes((l) => l - 1);
      setHasLiked(false);
    }
  };

  const handleShare = async () => {
    const text = `"${reason.text}" — Reason to Stay`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id={`reason-${reason._id}`}
      className="group flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-5 sm:p-6 transition-all hover:border-stone-350 dark:hover:border-stone-700"
    >
      <div className="space-y-3">
        {/* Category & Author */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {reason.category}
          </span>
          <span className="text-[11px] text-stone-400 dark:text-stone-500 italic">
            from {reason.author}
          </span>
        </div>

        {/* Reason Quote */}
        <p className="font-serif text-stone-800 dark:text-stone-200 text-base sm:text-[17px] leading-relaxed">
          &ldquo;{reason.text}&rdquo;
        </p>
      </div>

      {/* Footer Reactions */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleLike}
          disabled={hasLiked}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
            hasLiked
              ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100/60 dark:hover:bg-stone-800/50"
          }`}
          title="This resonates with me"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              hasLiked ? "text-rose-600 fill-rose-600" : "text-stone-400"
            }`}
          />
          <span>Resonates</span>
          <span className="text-stone-400 font-normal">({likes})</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md transition-colors"
          title="Copy reason"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-[11px] text-stone-700 dark:text-stone-300 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied</span>
            </span>
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
