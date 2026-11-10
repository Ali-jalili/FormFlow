/** @format */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import useResponses, {
  RESPONSE_PAGE_SIZE,
} from "../features/form/hooks/useResponses";
import useFormFields from "../features/form/hooks/useFormFields";
import useForms from "../features/form/hooks/useForms";
import { getAllResponses } from "../features/form/services/formsService";
import { buildCsv } from "../features/form/utils/csv.utils";

import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";

import {
  ArrowLeft,
  BarChart3,
  FileText,
  Inbox,
  Clock,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

function ResponsesPage() {
  const { formId } = useParams();

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const {
    data: responses,
    count: filteredCount,
    totalCount,
    isLoading,
    error,
  } = useResponses(formId, page, searchTerm);
  const { data: fieldsData } = useFormFields(formId);
  const { data: formsList } = useForms();

  const formData = formsList?.find((form) => form.id === formId);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCount / RESPONSE_PAGE_SIZE),
  );

  async function exportCsv() {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const allResponses = await getAllResponses(formId);
      const fields = fieldsData ?? [];
      const header = [
        "Submission date",
        ...fields.map((field) => field.label || field.id),
      ];

      const rows = allResponses.map((response) => [
        new Date(response.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...fields.map((field) => response.data?.[field.id] ?? ""),
      ]);

      const blob = new Blob([`\uFEFF${buildCsv([header, ...rows])}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `form-${formId}-responses-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Responses exported to CSV.");
    } catch (exportError) {
      toast.error(exportError.message || "Unable to export responses.");
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading) return <Spinner />;

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!responses) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <header className="mb-8">
          <Link
            to="/dashboard"
            className="
              group
              mb-5
              inline-flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-slate-500
              transition-colors
              duration-200
              hover:text-indigo-600
            "
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              {/* Header Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-sm">
                <BarChart3 className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h1
                  className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
                  title={formData?.title}
                >
                  {formData?.title || "Form Responses"}
                </h1>
              </div>
            </div>

            {/* Response Total Counter Card + Export */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 px-4 shadow-sm sm:shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-slate-900">
                  {totalCount}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Submissions
                </p>
              </div>
              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={isExporting}
                  title="Export all responses to CSV"
                  aria-label="Export responses to CSV"
                  className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Empty State */}
        {totalCount === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center backdrop-blur-sm sm:p-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 shadow-inner">
              <Inbox className="h-8 w-8" />
            </div>

            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              No responses recorded yet
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
              {formData?.is_published
                ? "Your form is live. Share its public link to start collecting responses."
                : "Publish your form to get a shareable link and start collecting responses."}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                to={`/builder/${formId}`}
                className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-md
                shadow-indigo-200
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-indigo-700
                hover:shadow-lg
                active:scale-95
              "
              >
                <FileText className="h-4 w-4" />
                Open Form Builder
              </Link>
              {formData?.is_published && formData?.public_id && (
                <Link
                  to={`/form/${formData.public_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open published form
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(0);
                    setSelectedResponse(null);
                  }}
                  placeholder="Search answers and questions..."
                  aria-label="Search responses by answer or question"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setPage(0);
                      setSelectedResponse(null);
                    }}
                    aria-label="Clear response search"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <p className="shrink-0 text-xs font-medium text-slate-500" aria-live="polite">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredCount}
                </span>{" "}
                of {totalCount} responses
              </p>
            </div>

            {filteredCount === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <Search className="h-7 w-7 text-slate-300" />
                <h2 className="mt-3 text-sm font-bold text-slate-800">
                  No matching responses
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Try a different answer or question.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setPage(0);
                    setSelectedResponse(null);
                  }}
                  className="mt-4 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[minmax(270px,0.78fr)_minmax(0,1.7fr)]">
                <aside className="border-b border-slate-200 bg-slate-50/60 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">Inbox</p>
                      <h2 className="mt-1 text-sm font-bold text-slate-800">Recent submissions</h2>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      {filteredCount}
                    </span>
                  </div>

                  <nav aria-label="Form responses" className="max-h-[620px] overflow-y-auto">
                    {(responses ?? []).map((response, index) => {
                      const number = page * RESPONSE_PAGE_SIZE + index + 1;
                      const isSelected = selectedResponse?.id === response.id;
                      const previewField = (fieldsData ?? []).find((field) => {
                        const answer = response.data?.[field.id];
                        return answer !== null && answer !== undefined && String(answer).trim() !== "";
                      });

                      return (
                        <button
                          key={response.id}
                          type="button"
                          onClick={() => setSelectedResponse(response)}
                          aria-current={isSelected ? "true" : undefined}
                          aria-label={`Open submission #${number}`}
                          className={`group relative flex w-full items-start gap-3 border-t border-slate-200/70 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${isSelected ? "bg-white" : "hover:bg-white/80"}`}
                        >
                          <span className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-500 ring-1 ring-slate-200 group-hover:text-indigo-600">
                            {String(number).padStart(2, "0")}
                            {index < responses.length - 1 && <span className="absolute -bottom-6 left-1/2 h-4 w-px -translate-x-1/2 bg-slate-200" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className={`truncate text-xs font-bold ${isSelected ? "text-indigo-700" : "text-slate-800"}`}>
                                Submission #{number}
                              </span>
                              <span className="shrink-0 text-[10px] font-medium text-slate-400">
                                {new Date(response.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </span>
                            <span className="mt-1 block text-[10px] font-medium text-slate-400">
                              {new Date(response.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="mt-2 block truncate text-[11px] text-slate-500">
                              {previewField ? String(response.data[previewField.id]) : "No answers provided"}
                            </span>
                          </span>
                          {isSelected && <span className="absolute inset-y-0 left-0 w-0.5 bg-indigo-500" />}
                        </button>
                      );
                    })}
                  </nav>

                  {filteredCount > RESPONSE_PAGE_SIZE && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => { setPage((current) => Math.max(0, current - 1)); setSelectedResponse(null); }}
                        disabled={page === 0}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                      </button>
                      <span className="text-[10px] font-medium text-slate-400">{page + 1} / {totalPages}</span>
                      <button
                        type="button"
                        onClick={() => { setPage((current) => Math.min(totalPages - 1, current + 1)); setSelectedResponse(null); }}
                        disabled={page >= totalPages - 1}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </aside>

                <section aria-live="polite" className="min-h-[420px] bg-white">
                  {selectedResponse ? (
                    <>
                      <header className="border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">Response detail</p>
                            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                              Submission #{(responses ?? []).findIndex((item) => item.id === selectedResponse.id) + page * RESPONSE_PAGE_SIZE + 1}
                            </h2>
                          </div>
                          <p className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(selectedResponse.created_at).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </header>
                      <div className="px-6 py-2 sm:px-8">
                        {(fieldsData ?? []).map((field, index) => {
                          const answer = selectedResponse.data?.[field.id];
                          const hasAnswer = answer !== null && answer !== undefined && String(answer).trim() !== "";
                          return (
                            <div key={field.id} className="grid gap-2 border-b border-slate-100 py-5 last:border-0 sm:grid-cols-[minmax(130px,0.7fr)_minmax(0,1.6fr)] sm:gap-6">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                <span className="mr-2 text-indigo-300">{String(index + 1).padStart(2, "0")}</span>
                                {field.label || "Untitled question"}
                              </p>
                              {hasAnswer ? (
                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{String(answer)}</p>
                              ) : (
                                <span className="text-xs italic text-slate-400">No answer provided</span>
                              )}
                            </div>
                          );
                        })}
                        {(() => {
                          const currentFieldIds = new Set((fieldsData ?? []).map((field) => field.id));
                          const orphanedEntries = Object.entries(selectedResponse.data ?? {}).filter(
                            ([fieldId, answer]) => !currentFieldIds.has(fieldId) && String(answer ?? "").trim() !== "",
                          );
                          if (orphanedEntries.length === 0) return null;
                          return (
                            <div className="border-t border-slate-100 py-5">
                              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Legacy answers</p>
                              <div className="space-y-3">
                                {orphanedEntries.map(([fieldId, answer]) => (
                                  <div key={fieldId} className="grid gap-2 sm:grid-cols-[minmax(130px,0.7fr)_minmax(0,1.6fr)] sm:gap-6">
                                    <p className="text-xs font-medium text-slate-500">{fieldId}</p>
                                    <p className="whitespace-pre-wrap break-words text-sm text-slate-700">{String(answer)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-[520px] flex-col items-center justify-center px-8 text-center">
                      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                        <Inbox className="h-8 w-8" />
                        <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-white bg-amber-300" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Your inbox is ready</p>
                      <h2 className="mt-2 text-lg font-bold text-slate-900">Choose a response to read</h2>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                        Select a submission from the timeline and its answers will appear here.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default ResponsesPage;
