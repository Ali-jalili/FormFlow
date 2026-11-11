/** @format */

import { Layout } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gray-50/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
        <Link
          to="/"
          aria-label="FormFlow home"
          className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-gray-800 transition-colors hover:text-indigo-600"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Layout className="h-4 w-4" />
          </span>
          FormFlow
        </Link>
        <p className="text-xs text-gray-400">
          © {currentYear} FormFlow. Create forms, collect responses.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
