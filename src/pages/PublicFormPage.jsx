/** @format */

import { useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Send,
  CheckCircle2,
  Loader2,
  FileText,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import usePublicForm from "../features/form/hooks/usePublicForm";
import { submitResponse } from "../features/form/services/formsService";
import { FORM_FIELD_TYPES } from "../features/form/utils/form.constants";

import Spinner from "../components/ui/Spinner";
import ErrorMessage from "../components/ui/ErrorMessage";

function PublicFormPage() {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const { publicId } = useParams();
  const { data, isLoading, error } = usePublicForm(publicId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60">
        <Spinner />
      </div>
    );
  }

  if (error) {
    const isUnavailable =
      error.code === "PGRST116" || /not available/i.test(error.message);

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4">
        <div className="w-full max-w-md text-center">
          {isUnavailable ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-500">
                <AlertCircle className="h-8 w-8" />
              </div>

              <h1 className="text-xl font-bold text-slate-900">
                This form is no longer available
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                The link you followed may be outdated, or the form owner
                unpublished it. Please contact the person who shared the form.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
              <ErrorMessage message={error.message} />
            </div>
          )}
        </div>
      </div>
    );
  }

  function validateAnswers() {
    if (!data?.fields?.length) {
      setSubmitError("This form has no fields to answer.");
      return false;
    }

    const errors = {};

    for (const field of data.fields) {
      if (!field.required) continue;

      const answer = answers[field.id];

      if (!answer || (typeof answer === "string" && answer.trim() === "")) {
        errors[field.id] = `${field.label || "This field"} is required`;
      }
    }

    const hasAnyAnswer = Object.values(answers).some((answer) => {
      if (typeof answer === "string") {
        return answer.trim() !== "";
      }

      return answer !== null && answer !== undefined;
    });

    if (!hasAnyAnswer) {
      setSubmitError("Please answer at least one question.");
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0 && hasAnyAnswer;
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (!validateAnswers()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // The RPC validates server-side and returns the new response id.
      await submitResponse(publicId, answers);

      toast.success("Response submitted!");

      setIsSubmitted(true);
      setAnswers({});
      setFieldErrors({});
    } catch (error) {
      setSubmitError(
        error?.message || "Failed to submit response. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Submitted View */
  if (isSubmitted) {
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

  if (!data) return null;

  const fields = data.fields || [];

  /* Empty Form View */
  if (fields.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-500">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              This form is empty
            </h1>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              There are currently no questions available in this form.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header Block */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-600">
            <FileText className="h-3.5 w-3.5" />
            <span>Public Form</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {data.form.title || "Untitled Form"}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Please fill out the information below and click submit when
            completed.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-400 sm:justify-start">
            <span>
              {fields.length} {fields.length === 1 ? "question" : "questions"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-rose-500 font-bold">*</span> Required fields
            </span>
          </div>
        </div>

        {/* Main Form Body */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          <div className="p-6 sm:p-10">
            <div className="space-y-6 sm:space-y-8">
              {fields.map((field) => {
                const answer = answers[field.id] || "";

                return (
                  <div
                    key={field.id}
                    className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50/80"
                  >
                    {/* Label */}
                    <div className="mb-3">
                      <label
                        htmlFor={`field-${field.id}`}
                        className="flex items-center justify-between text-xs font-bold text-slate-800 sm:text-sm"
                      >
                        <span>
                          {field.label || "Untitled Field"}
                          {field.required && (
                            <span className="ml-1 text-rose-500">*</span>
                          )}
                        </span>
                        {field.required && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Required
                          </span>
                        )}
                      </label>
                      {fieldErrors[field.id] && (
                        <p
                          id={`field-error-${field.id}`}
                          role="alert"
                          className="mt-1.5 text-xs font-medium text-rose-600"
                        >
                          {fieldErrors[field.id]}
                        </p>
                      )}
                    </div>

                    {/* Short text */}
                    {field.type === FORM_FIELD_TYPES.SHORT_TEXT && (
                      <input
                        id={`field-${field.id}`}
                        aria-describedby={
                          fieldErrors[field.id]
                            ? `field-error-${field.id}`
                            : undefined
                        }
                        value={answer}
                        onChange={(e) => {
                          setAnswers((current) => ({
                            ...current,
                            [field.id]: e.target.value,
                          }));
                          if (fieldErrors[field.id]) {
                            setFieldErrors((current) => {
                              const next = { ...current };
                              delete next[field.id];
                              return next;
                            });
                          }
                        }}
                        type="text"
                        placeholder="Type your answer..."
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 sm:text-sm"
                      />
                    )}

                    {/* Long text */}
                    {field.type === FORM_FIELD_TYPES.LONG_TEXT && (
                      <textarea
                        id={`field-${field.id}`}
                        aria-describedby={
                          fieldErrors[field.id]
                            ? `field-error-${field.id}`
                            : undefined
                        }
                        value={answer}
                        onChange={(e) => {
                          setAnswers((current) => ({
                            ...current,
                            [field.id]: e.target.value,
                          }));
                          if (fieldErrors[field.id]) {
                            setFieldErrors((current) => {
                              const next = { ...current };
                              delete next[field.id];
                              return next;
                            });
                          }
                        }}
                        rows={4}
                        placeholder="Type your answer..."
                        disabled={isSubmitting}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 sm:text-sm"
                      />
                    )}

                    {/* Multiple choice */}
                    {field.type === FORM_FIELD_TYPES.MULTIPLE_CHOICE && (
                      <div role="radiogroup" className="space-y-2.5">
                        {field.options
                          ?.filter((opt) => opt && opt.trim() !== "")
                          .map((opt, i) => {
                            const inputId = `${field.id}-opt-${i}`;
                            const selected = answers[field.id] === opt;

                            return (
                              <label
                                key={inputId}
                                htmlFor={inputId}
                                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                  selected
                                    ? "border-indigo-500 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500/20"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                } ${
                                  isSubmitting
                                    ? "cursor-not-allowed opacity-70"
                                    : "cursor-pointer"
                                }`}
                              >
                                <input
                                  id={inputId}
                                  type="radio"
                                  name={`field-${field.id}`}
                                  value={opt}
                                  disabled={isSubmitting}
                                  checked={selected}
                                  onChange={() => {
                                    setAnswers((current) => ({
                                      ...current,
                                      [field.id]: opt,
                                    }));
                                    if (fieldErrors[field.id]) {
                                      setFieldErrors((current) => {
                                        const next = { ...current };
                                        delete next[field.id];
                                        return next;
                                      });
                                    }
                                  }}
                                  className="peer sr-only"
                                />
                                <span
                                  aria-hidden="true"
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                    selected
                                      ? "border-indigo-600 bg-indigo-600"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {selected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                  )}
                                </span>

                                <span
                                  className={`text-xs font-medium sm:text-sm ${
                                    selected
                                      ? "font-semibold text-indigo-950"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action Block */}
            <div className="mt-10 border-t border-slate-100 pt-6">
              {submitError && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
                >
                  {submitError}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-indigo-200/80 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300/80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting response...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span>Submit response</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span>Your answers will be securely submitted.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicFormPage;
