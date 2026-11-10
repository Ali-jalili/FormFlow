/** @format */

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Layout,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  ChevronDown,
  X,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../features/Auth/useAuth";

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function handle(event) {
      if (ref.current && !ref.current.contains(event.target)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

function Header() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);

  useOutsideClick(userMenuRef, () => setIsUserOpen(false));

  const displayName =
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "Account");
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function onLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await handleLogout();
      setIsUserOpen(false);
      setIsMenuOpen(false);
      navigate("/", { replace: true });
      toast.success("You have been signed out.");
    } catch (error) {
      toast.error(error.message || "Unable to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Security", href: "/#security" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="group flex items-center gap-2.5"
          aria-label="FormFlow home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-200 group-hover:scale-105">
            <Layout className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold tracking-tight text-gray-900">
            FormFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggingOut ? (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600"
            >
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              Signing out…
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
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
              Signing out…
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
    </header>
  );
}

export default Header;
