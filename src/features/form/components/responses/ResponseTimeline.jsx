import { ChevronLeft, ChevronRight } from "lucide-react";

function ResponseTimeline({ responses, fields, page, pageSize, totalPages, filteredCount, selectedResponse, onSelectResponse, onPageChange }) {
  return (
      <aside className="border-b border-slate-200 bg-slate-50/60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
              Inbox
            </p>
            <h2 className="mt-1 text-sm font-bold text-slate-800">
              Recent submissions
            </h2>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
            {filteredCount}
          </span>
        </div>

        <nav aria-label="Form responses" className="max-h-[620px] overflow-y-auto">
          {responses.map((response, index) => {
            const number = page * pageSize + index + 1;
            const isSelected = selectedResponse?.id === response.id;
            const previewField = fields.find((field) => {
              const answer = response.data?.[field.id];
              return answer !== null && answer !== undefined && String(answer).trim() !== "";
            });

            return (
              <button
                key={response.id}
                type="button"
                onClick={() => onSelectResponse(response)}
                aria-current={isSelected ? "true" : undefined}
                aria-label={`Open submission #${number}`}
                className={`group relative flex w-full items-start gap-3 border-t border-slate-200/70 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${isSelected ? "bg-white" : "hover:bg-white/80"}`}
              >
                <span className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-500 ring-1 ring-slate-200 group-hover:text-indigo-600">
                  {String(number).padStart(2, "0")}
                  {index < responses.length - 1 && (
                    <span className="absolute -bottom-6 left-1/2 h-4 w-px -translate-x-1/2 bg-slate-200" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-xs font-bold ${isSelected ? "text-indigo-700" : "text-slate-800"}`}
                    >
                      Submission #{number}
                    </span>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400">
                      {new Date(response.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                  <span className="mt-1 block text-[10px] font-medium text-slate-400">
                    {new Date(response.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="mt-2 block truncate text-[11px] text-slate-500">
                    {previewField
                      ? String(response.data[previewField.id])
                      : "No answers provided"}
                  </span>
                </span>
                {isSelected && (
                  <span className="absolute inset-y-0 left-0 w-0.5 bg-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        {filteredCount > pageSize && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span className="text-[10px] font-medium text-slate-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </aside>
  );
}

export default ResponseTimeline;
