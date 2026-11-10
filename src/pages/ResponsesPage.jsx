/** @format */

import { useParams, Link } from "react-router-dom";

import useResponses from "../features/form/hooks/useResponses";
import useFormFields from "../features/form/hooks/useFormFields";
import useForms from "../features/form/hooks/useForms";

import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";

import {
  ArrowLeft,
  MessageSquare,
  BarChart3,
  FileText,
  Inbox,
  Clock,
  Sparkles,
} from "lucide-react";

function ResponsesPage() {
  const { formId } = useParams();

  const { data: responses, isLoading, error } = useResponses(formId);
  const { data: fieldsData } = useFormFields(formId);
  const { data: formsList } = useForms();

  const formData = formsList?.find((form) => form.id === formId);

  if (isLoading) return <Spinner />;

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!responses) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    {responses.length}{" "}
                    {responses.length === 1 ? "response" : "responses"} received
                  </span>
                </div>
              </div>
            </div>

            {/* Response Total Counter Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 px-4 shadow-sm sm:shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-slate-900">
                  {responses.length}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Submissions
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        {responses.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center backdrop-blur-sm sm:p-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 shadow-inner">
              <Inbox className="h-8 w-8" />
            </div>

            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              No responses recorded yet
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
              Share your form link to start receiving feedback and submission
              data here.
            </p>

            <Link
              to={`/builder/${formId}`}
              className="
                mt-6
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
          </div>
        ) : (
          /* Response List */
          <div className="space-y-4">
            {responses.map((response, index) => (
              <article
                key={response.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-slate-300
                  hover:shadow-md
                "
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 transition-colors group-hover:bg-indigo-600" />

                {/* Response Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-indigo-500/10">
                      #{index + 1}
                    </span>
                    <p className="text-xs font-bold text-slate-800 sm:text-sm">
                      Submission #{index + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {new Date(response.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Answers Body */}
                <div className="divide-y divide-slate-100/70 px-5 sm:px-6">
                  {fieldsData?.map((field) => {
                    const answer = response.data?.[field.id];
                    const hasAnswer =
                      answer !== null &&
                      answer !== undefined &&
                      String(answer).trim() !== "";

                    return (
                      <div
                        key={field.id}
                        className="py-3.5 first:pt-4 last:pb-4"
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {field.label}
                        </p>

                        <div>
                          {hasAnswer ? (
                            <p className="whitespace-pre-wrap break-words text-sm font-medium text-slate-800">
                              {String(answer)}
                            </p>
                          ) : (
                            <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium italic text-slate-400">
                              No answer provided
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Orphaned answers: submitted for fields that no longer
                      exist on the form (deleted between submit and now). */}
                  {(() => {
                    const currentFieldIds = new Set(
                      fieldsData?.map((f) => f.id) ?? [],
                    );
                    const orphanedEntries = Object.entries(
                      response.data ?? {},
                    ).filter(
                      ([fieldId]) =>
                        !currentFieldIds.has(fieldId) &&
                        String(response.data?.[fieldId] ?? "").trim() !== "",
                    );

                    if (orphanedEntries.length === 0) return null;

                    return (
                      <div className="py-3.5">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Legacy answers
                        </p>
                        <p className="mb-2 text-[11px] italic text-slate-400">
                          Answers to questions that were later removed from this
                          form.
                        </p>
                        <div className="space-y-1.5">
                          {orphanedEntries.map(([fieldId, answer]) => (
                            <div
                              key={fieldId}
                              className="rounded-lg bg-slate-50 px-3 py-2"
                            >
                              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                {fieldId}
                              </p>
                              <p className="whitespace-pre-wrap break-words text-sm font-medium text-slate-700">
                                {String(answer)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponsesPage;
