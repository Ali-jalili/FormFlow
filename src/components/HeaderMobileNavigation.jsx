import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Loader2, LogOut } from "lucide-react";

function HeaderMobileNavigation({ isMenuOpen, isLoggingOut, user, navLinks, onLogout, setIsMenuOpen }) {
  return (
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-200 md:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}

          <div className="my-2 border-t border-gray-100" />

          {isLoggingOut ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-600"
            >
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              Signing outâ€¦
            </div>
          ) : user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
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
                onClick={onLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="mt-1 flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
  );
}

export default HeaderMobileNavigation;
