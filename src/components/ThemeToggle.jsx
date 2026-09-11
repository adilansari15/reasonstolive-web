import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export function ThemeToggle({ id = "theme-toggle-btn" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-lg text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800 transition-colors focus:outline-none"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 text-stone-600" />
      )}
    </button>
  );
}
