/** @format */

import { CheckCircle2 } from "lucide-react";

function PublicFormSuccess() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50/60 px-4 py-12 overflow-hidden">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md text-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/80 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Response submitted
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Thank you for taking the time. Your response has been securely
            recorded.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicFormSuccess;
