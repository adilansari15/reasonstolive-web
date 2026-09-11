import { CATEGORIES, MOODS } from "../utils/constants.js";

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedMood,
  onSelectMood,
}) {
  const allCategories = ["All", ...CATEGORIES];

  return (
    <div className="space-y-3">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
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

      {/* Mood Filter */}
      {onSelectMood && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 dark:text-stone-500 font-medium whitespace-nowrap mr-1">
            Mood:
          </span>
          <button
            type="button"
            onClick={() => onSelectMood("All")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedMood === "All" || !selectedMood
                ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850"
            }`}
          >
            All Feelings
          </button>
          {MOODS.map((m) => {
            const isActive = selectedMood === m.name;
            return (
              <button
                key={m.name}
                type="button"
                onClick={() => onSelectMood(m.name)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isActive
                    ? "bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100 font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
