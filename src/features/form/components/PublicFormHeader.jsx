/** @format */

import { FileText } from "lucide-react";

function PublicFormHeader({ title, fieldCount }) {
  return (
    <div className="mb-8 text-center sm:text-left">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-600">
        <FileText className="h-3.5 w-3.5" />
        <span>Public Form</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title || "Untitled Form"}
      </h1>

      <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
        Please fill out the information below and click submit when completed.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-400 sm:justify-start">
        <span>
          {fieldCount} {fieldCount === 1 ? "question" : "questions"}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="text-rose-500 font-bold">*</span> Required fields
        </span>
      </div>
    </div>
  );
}

export default PublicFormHeader;
