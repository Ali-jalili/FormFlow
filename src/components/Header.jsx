/** @format */

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../features/Auth/useAuth";
import useOutsideClick from "../hooks/useOutsideClick";
import HeaderDesktopActions from "./HeaderDesktopActions";
import HeaderMobileNavigation from "./HeaderMobileNavigation";

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
        <HeaderDesktopActions user={user} isLoggingOut={isLoggingOut} displayName={displayName} initials={initials} isUserOpen={isUserOpen} setIsUserOpen={setIsUserOpen} userMenuRef={userMenuRef} onLogout={onLogout} />

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
      <HeaderMobileNavigation isMenuOpen={isMenuOpen} isLoggingOut={isLoggingOut} user={user} navLinks={navLinks} onLogout={onLogout} setIsMenuOpen={setIsMenuOpen} />
    </header>
  );
}

export default Header;
