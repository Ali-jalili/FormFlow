import { Link, NavLink } from "react-router-dom";
import { ChevronDown, LayoutDashboard, Loader2, LogOut, Settings } from "lucide-react";

function HeaderDesktopActions({ user, isLoggingOut, displayName, initials, isUserOpen, setIsUserOpen, userMenuRef, onLogout }) {
  return (
        <div className="hidden items-center gap-3 md:flex">
          {isLoggingOut ? (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600"
            >
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              Signing outâ€¦
            </div>
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserOpen((current) => !current)}
                aria-expanded={isUserOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-1.5 pr-2.5 pl-1.5 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="max-w-[9rem] truncate text-sm font-semibold text-gray-700">
                  {displayName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isUserOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-200/60"
                >
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsUserOpen(false)}
                    className={({ isActive }) =>
                      `mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => setIsUserOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
              >
                Get started
              </Link>
            </>
          )}
        </div>
  );
}

export default HeaderDesktopActions;
