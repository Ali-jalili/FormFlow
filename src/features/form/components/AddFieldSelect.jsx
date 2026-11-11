/** @format */

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  ListChecks,
  Plus,
  Type,
} from "lucide-react";

import { FORM_FIELD_TYPES } from "../utils/form.constants";

const FIELD_OPTIONS = [
  {
    type: FORM_FIELD_TYPES.SHORT_TEXT,
    label: "Short text",
    description: "A single line answer",
    icon: Type,
  },
  {
    type: FORM_FIELD_TYPES.LONG_TEXT,
    label: "Long text",
    description: "A longer written response",
    icon: FileText,
  },
  {
    type: FORM_FIELD_TYPES.MULTIPLE_CHOICE,
    label: "Multiple choice",
    description: "Let users choose an option",
    icon: ListChecks,
  },
];

function AddFieldSelect({ onAddField }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleAddField(type) {
    onAddField(type);
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`
          group flex w-full items-center justify-between
          rounded-xl border-2 border-dashed
          px-4 py-3.5
          text-sm font-semibold
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          ${
            isOpen
              ? "border-indigo-400 bg-indigo-50/60 text-indigo-700"
              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
          }
        `}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`
              flex h-7 w-7 items-center justify-center rounded-lg
              transition-colors
              ${
                isOpen
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-white text-gray-400 shadow-sm group-hover:bg-indigo-100 group-hover:text-indigo-600"
              }
            `}
          >
            <Plus className="h-4 w-4" />
          </span>
          Add a field
        </span>

        <ChevronDown
          className={`
            h-4 w-4 text-gray-400 transition-transform duration-200
            ${isOpen ? "rotate-180 text-indigo-500" : ""}
          `}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="
            absolute top-full left-0 z-30 mt-2 w-full
            overflow-hidden rounded-2xl
            border border-gray-200
            bg-white
            p-2
            shadow-xl shadow-gray-200/60
            animate-in fade-in slide-in-from-top-2
            duration-200
          "
        >
          <div className="px-3 pb-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Choose a field type
            </p>
          </div>

          <div className="space-y-1">
            {FIELD_OPTIONS.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.type}
                  type="button"
                  role="menuitem"
                  onClick={() => handleAddField(option.type)}
                  className="
                    group flex w-full items-center gap-3
                    rounded-xl p-3
                    text-left
                    transition-all duration-150
                    hover:bg-indigo-50
                  "
                >
                  <span
                    className="
                      flex h-10 w-10 shrink-0 items-center justify-center
                      rounded-xl
                      bg-gray-50
                      text-gray-500
                      transition-colors
                      group-hover:bg-white
                      group-hover:text-indigo-600
                      group-hover:shadow-sm
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                      {option.label}
                    </span>

                    <span className="mt-0.5 block text-xs text-gray-400">
                      {option.description}
                    </span>
                  </span>

                  <Check
                    className="
                      h-4 w-4
                      text-indigo-500
                      opacity-0
                      transition-opacity
                      group-hover:opacity-100
                    "
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddFieldSelect;
