import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar.jsx";
import { CategoryFilter } from "../components/CategoryFilter.jsx";
import { PostList } from "../components/PostList.jsx";
import { api } from "../services/api.js";
import { PenLine, RefreshCw } from "lucide-react";

export function WallPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mood, setMood] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getPosts({
        category: category !== "All" ? category : undefined,
        mood: mood !== "All" ? mood : undefined,
        search: search.trim() ? search.trim() : undefined,
        sort,
        page,
        limit: 8,
      });
      setPosts(res.posts);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load wall posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, mood, sort, page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePostReact = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            The Letters Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal mt-1">
            Anonymous Letters of Hope
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Real reflections and quiet messages of solidarity from people across the world.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => fetchPosts()}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            title="Refresh letters"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-stone-900 dark:text-stone-100" : ""}`} />
          </button>

          <Link
            to="/share"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-all"
            id="wall-share-btn"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write a Letter</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3.5">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search letters by feeling, loneliness, heartbreak, healing, exams..."
        />

        <CategoryFilter
          selectedCategory={category}
          onSelectCategory={(cat) => {
            setCategory(cat);
            setPage(1);
          }}
          selectedMood={mood}
          onSelectMood={(m) => {
            setMood(m);
            setPage(1);
          }}
        />
      </div>

      {/* Post List */}
      <PostList
        posts={posts}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
        onPostReact={handlePostReact}
      />
    </div>
  );
}
