import { useState, useEffect, useCallback } from "react";
import {
  Trash2, Search, RefreshCw, Lock, LogOut,
  AlertTriangle, Clock, Sparkles, Heart, KeyRound, Eye, EyeOff, CheckCircle2,
} from "lucide-react";
import { api } from "../services/api.js";
import { formatTimeAgo } from "../utils/constants.js";

// ── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return sessionStorage.getItem("adminToken");
}

function saveToken(token) {
  sessionStorage.setItem("adminToken", token);
}

function clearToken() {
  sessionStorage.removeItem("adminToken");
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
        toast.type === "error"
          ? "bg-red-600 text-white"
          : "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
      }`}
    >
      {toast.type === "error" ? (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      )}
      {toast.message}
    </div>
  );
}

// ── Login Gate ────────────────────────────────────────────────────────────────

function LoginGate({ onLogin }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.adminLogin(password);
      saveToken(token);
      onLogin();
    } catch (err) {
      setError(err.message || "Incorrect password.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 mb-4">
            <Lock className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </div>
          <h1 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Admin Panel</h1>
          <p className="text-sm text-stone-500 mt-1">Enter your admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              required
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ onClose, onSuccess }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.adminChangePassword(current, next);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] p-6 shadow-xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-stone-500" />
          <h2 className="font-serif text-xl text-stone-900 dark:text-stone-100">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Current */}
          <div className="relative">
            <label className="block text-xs text-stone-500 mb-1">Current password</label>
            <input
              type={showCurrent ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 text-stone-400">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* New */}
          <div className="relative">
            <label className="block text-xs text-stone-500 mb-1">New password (min 8 chars)</label>
            <input
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button type="button" onClick={() => setShowNext((s) => !s)} className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 text-stone-400">
              {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-xs text-stone-500 mb-1">Confirm new password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Saving…" : "Change Password"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showChangePw, setShowChangePw] = useState(false);

  const LIMIT = 20;

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleLogout() {
    clearToken();
    window.location.reload();
  }

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.adminGetAllPosts({ page, limit: LIMIT, search: search.trim() || undefined });
      setPosts(res.posts || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      if (err.message.toLowerCase().includes("session") || err.message.toLowerCase().includes("unauthorized")) {
        clearToken();
        window.location.reload();
      }
      showToast("Failed to load letters: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Debounce search → reset to page 1
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 350);
    return () => clearTimeout(t);
  }, [search]);

  async function handleDelete(id) {
    setDeletingId(id);
    setConfirmId(null);
    try {
      await api.adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
      showToast("Letter deleted.");
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">
      <Toast toast={toast} />

      {showChangePw && (
        <ChangePasswordModal
          onClose={() => setShowChangePw(false)}
          onSuccess={() => {
            setShowChangePw(false);
            showToast("Password changed successfully! Please log in again.", "success");
            setTimeout(() => { clearToken(); window.location.reload(); }, 2000);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Admin</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal mt-1">
            Manage Letters
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {total} letter{total !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowChangePw(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 hover:border-stone-400 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 hover:border-stone-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search letters…"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <button
          onClick={fetchPosts}
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1B19] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Post List */}
      {loading && posts.length === 0 ? (
        <div className="py-20 text-center text-stone-400 text-sm">Loading letters…</div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-stone-400 text-sm">No letters found.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-stone-700 dark:text-stone-300">{post.category}</span>
                    {post.mood && (
                      <>
                        <span className="text-stone-300 dark:text-stone-700">·</span>
                        <span className="italic">feeling {post.mood.toLowerCase()}</span>
                      </>
                    )}
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {post.helpfulCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.heartCount || 0}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 select-all">
                      {post._id}
                    </span>
                  </div>
                  <p className="font-serif text-stone-800 dark:text-stone-200 text-sm sm:text-[15px] leading-relaxed line-clamp-4">
                    "{post.content}"
                  </p>
                </div>

                <div className="shrink-0">
                  {confirmId === post._id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                      >
                        {deletingId === post._id ? "Deleting…" : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(post._id)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete letter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-stone-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────

export function AdminPage() {
  const [authed, setAuthed] = useState(!!getToken());

  if (!authed) {
    return <LoginGate onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard />;
}
