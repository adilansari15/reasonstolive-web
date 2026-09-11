import { useState } from "react";
import { Sparkles, Heart, Clock, Share2, Check } from "lucide-react";
import { formatTimeAgo } from "../utils/constants.js";
import { api } from "../services/api.js";

export function PostCard({ post }) {
  const [helpfulCount, setHelpfulCount] = useState(post.helpfulCount || 0);
  const [heartCount, setHeartCount] = useState(post.heartCount || 0);
  const [hasHelped, setHasHelped] = useState(false);
  const [hasHearted, setHasHearted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleHelpful = async (e) => {
    e.preventDefault();
    if (hasHelped) return;
    setHasHelped(true);
    setHelpfulCount((prev) => prev + 1);
    try {
      await api.reactToPost(post._id, "helpful");
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  const handleHeart = async (e) => {
    e.preventDefault();
    if (hasHearted) return;
    setHasHearted(true);
    setHeartCount((prev) => prev + 1);
    try {
      await api.reactToPost(post._id, "heart");
    } catch (err) {
      console.error("Failed to heart:", err);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    const textToCopy = `"${post.content}" — via Reasons to Stay`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      id={`post-${post._id}`}
      className="group flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-5 sm:p-6 transition-all hover:border-stone-350 dark:hover:border-stone-700"
    >
      <div className="space-y-4">
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {post.category}
            </span>
            {post.mood && (
              <>
                <span className="text-stone-300 dark:text-stone-700">&middot;</span>
                <span className="text-stone-500 dark:text-stone-400 italic">
                  feeling {post.mood.toLowerCase()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>

        {/* Letter Text - Serif typography */}
        <p className="font-serif text-stone-800 dark:text-stone-200 text-[15px] sm:text-[16.5px] leading-relaxed whitespace-pre-wrap">
          &ldquo;{post.content}&rdquo;
        </p>
      </div>

      {/* Footer Reactions & Share */}
      <div className="mt-6 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Helped Me button */}
          <button
            type="button"
            onClick={handleHelpful}
            disabled={hasHelped}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
              hasHelped
                ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100/60 dark:hover:bg-stone-800/50"
            }`}
            title="This helped me"
          >
            <Sparkles className={`w-3.5 h-3.5 ${hasHelped ? "text-amber-600 dark:text-amber-300" : "text-stone-400"}`} />
            <span>This helped</span>
            <span className="text-stone-400 font-normal">({helpfulCount})</span>
          </button>

          {/* Heart / Holding On button */}
          <button
            type="button"
            onClick={handleHeart}
            disabled={hasHearted}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
              hasHearted
                ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100/60 dark:hover:bg-stone-800/50"
            }`}
            title="Holding on with you"
          >
            <Heart className={`w-3.5 h-3.5 ${hasHearted ? "text-rose-600 fill-rose-600" : "text-stone-400"}`} />
            <span>Hold on</span>
            <span className="text-stone-400 font-normal">({heartCount})</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md transition-colors"
          title="Copy letter excerpt"
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
    </article>
  );
}
