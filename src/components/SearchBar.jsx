import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search letters by feeling, keyword, or struggle...",
  id = "posts-search-input",
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
