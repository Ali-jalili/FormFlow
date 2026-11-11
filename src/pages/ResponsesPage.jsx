/** @format */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import useResponses, {
  RESPONSE_PAGE_SIZE,
} from "../features/form/hooks/useResponses";
import useFormFields from "../features/form/hooks/useFormFields";
import useForms from "../features/form/hooks/useForms";
import useResponseCsvExport from "../features/form/hooks/useResponseCsvExport";
import ResponseWorkspace from "../features/form/components/responses/ResponseWorkspace";

import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";

import {
  ArrowLeft,
  BarChart3,
  FileText,
  Inbox,
  Sparkles,
  Download,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

function ResponsesPage() {
  const { formId } = useParams();

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
  const { isExporting, exportCsv } = useResponseCsvExport(
    formId,
    fieldsData ?? [],
  );

  const formData = formsList?.find((form) => form.id === formId);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCount / RESPONSE_PAGE_SIZE),
  );

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
              <ResponseWorkspace
                responses={responses ?? []}
                fields={fieldsData ?? []}
                page={page}
                pageSize={RESPONSE_PAGE_SIZE}
                totalPages={totalPages}
                filteredCount={filteredCount}
                selectedResponse={selectedResponse}
                onSelectResponse={setSelectedResponse}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  setSelectedResponse(null);
                }}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default ResponsesPage;
