import { PostCard } from "./PostCard.jsx";
import { MessageSquareDashed, ArrowUpDown, Loader2 } from "lucide-react";

export function PostList({
  posts,
  loading = false,
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  sort = "latest",
  onSortChange,
  onPostReact,
}) {
  if (loading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-12 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6" />
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/6" />
            </div>
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between">
              <div className="h-6 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-6 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
        <div>
          <span>Showing </span>
          <strong className="text-stone-800 dark:text-stone-200 font-semibold">{posts.length}</strong>
          {total > 0 && (
            <span>
              {" "}of <strong className="text-stone-800 dark:text-stone-200 font-semibold">{total}</strong> letters
            </span>
          )}
        </div>

        {onSortChange && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-stone-200/60 dark:bg-stone-800 text-xs">
              <button
                type="button"
                onClick={() => onSortChange("latest")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  sort === "latest"
                    ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => onSortChange("helpful")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  sort === "helpful"
                    ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                Most Resonant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of posts */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-800 p-12 text-center bg-white/40 dark:bg-[#1C1B19]/40">
          <MessageSquareDashed className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif text-base text-stone-800 dark:text-stone-200 mb-1">
            No letters match this view
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Try adjusting your search terms or select another category to explore more letters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onReact={onPostReact} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Previous
          </button>
          <span className="text-xs text-stone-500 dark:text-stone-400 px-2">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>Next</span>
          </button>
        </div>
      )}
    </div>
  );
}
