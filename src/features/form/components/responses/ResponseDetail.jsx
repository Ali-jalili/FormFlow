/** @format */

import { Clock, Inbox } from "lucide-react";

function renderLegacyAnswers(responseData = {}, fields) {
  const currentFieldIds = new Set(fields.map((field) => field.id));
  const orphanedEntries = Object.entries(responseData).filter(
    ([fieldId, answer]) =>
      !currentFieldIds.has(fieldId) && String(answer ?? "").trim() !== "",
  );

  if (orphanedEntries.length === 0) return null;

  return (
    <div className="border-t border-slate-100 py-5">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Legacy answers
      </p>
      <div className="space-y-3">
        {orphanedEntries.map(([fieldId, answer]) => (
          <div
            key={fieldId}
            className="grid gap-2 sm:grid-cols-[minmax(130px,0.7fr)_minmax(0,1.6fr)] sm:gap-6"
          >
            <p className="text-xs font-medium text-slate-500">{fieldId}</p>
            <p className="whitespace-pre-wrap break-words text-sm text-slate-700">
              {String(answer)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponseDetail({ selectedResponse, responses, page, pageSize, fields }) {
  return (
      <section className="min-h-[420px] bg-white">
        {selectedResponse ? (
          <>
            <header className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Response detail
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                    Submission #{
                      responses.findIndex((item) => item.id === selectedResponse.id) +
                      page * pageSize +
                      1
                    }
                  </h2>
                </div>
                <p className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(selectedResponse.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </header>
            <div className="px-6 py-2 sm:px-8">
              {fields.map((field, index) => {
                const answer = selectedResponse.data?.[field.id];
                const hasAnswer =
                  answer !== null &&
                  answer !== undefined &&
                  String(answer).trim() !== "";

                return (
                  <div
                    key={field.id}
                    className="grid gap-2 border-b border-slate-100 py-5 last:border-0 sm:grid-cols-[minmax(130px,0.7fr)_minmax(0,1.6fr)] sm:gap-6"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      <span className="mr-2 text-indigo-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {field.label || "Untitled question"}
                    </p>
                    {hasAnswer ? (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
                        {String(answer)}
                      </p>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        No answer provided
                      </span>
                    )}
                  </div>
                );
              })}
              {renderLegacyAnswers(selectedResponse.data, fields)}
            </div>
          </>
        ) : (
          <div className="flex min-h-[520px] flex-col items-center justify-center px-8 text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <Inbox className="h-8 w-8" />
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-white bg-amber-300" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
              Your inbox is ready
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Choose a response to read
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              Select a submission from the timeline and its answers will appear here.
            </p>
          </div>
        )}
      </section>
  );
}

export default ResponseDetail;
