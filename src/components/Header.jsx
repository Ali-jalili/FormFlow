/** @format */

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Layout, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

import useAuth from "../features/Auth/useAuth";

function Header() {
  const { user, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function onLogout() {
    closeMenu();
    await handleLogout();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
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
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <a
            href="/#features"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Features
          </a>

          <a
            href="/#how-it-works"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            How it works
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
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
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
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
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
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
          <a
            href="/#features"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Features
          </a>

          <a
            href="/#how-it-works"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            How it works
          </a>

          <div className="my-2 border-t border-gray-100" />

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
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
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
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
