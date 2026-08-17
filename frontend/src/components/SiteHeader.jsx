import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SiteHeader() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          LedgerFlow AI
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link to="/" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
            Home
          </Link>
          {token ? (
            <>
              <Link to="/dashboard" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                Dashboard
              </Link>
              <Link to="/upload" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                Upload Invoice
              </Link>
              {user ? (
                <span className="hidden rounded-2xl bg-slate-800/60 px-4 py-2 text-slate-300 sm:inline-block">
                  {user.name || user.email}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}