/** @format */

import { useParams } from "react-router-dom";
import { Send, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

import usePublicForm from "../features/form/hooks/usePublicForm";
import usePublicFormSubmit from "../features/form/hooks/usePublicFormSubmit";
import PublicFormHeader from "../features/form/components/PublicFormHeader";
import PublicFormField from "../features/form/components/PublicFormField";
import PublicFormSuccess from "../features/form/components/PublicFormSuccess";

import Spinner from "../components/ui/Spinner";
import ErrorMessage from "../components/ui/ErrorMessage";

function PublicFormPage() {
  const { publicId } = useParams();
  const { data, isLoading, error } = usePublicForm(publicId);

  const fields = data?.fields ?? [];
  const {
    answers,
    isSubmitted,
    isSubmitting,
    fieldErrors,
    submitError,
    updateAnswer,
    handleSubmit,
  } = usePublicFormSubmit(publicId, fields);

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

  /* Submitted View */
  if (isSubmitted) {
    return <PublicFormSuccess />;
  }

  if (!data) return null;

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
        <PublicFormHeader title={data.form.title} fieldCount={fields.length} />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          <div className="p-6 sm:p-10">
            <div className="space-y-6 sm:space-y-8">
              {fields.map((field) => (
                <PublicFormField
                  key={field.id}
                  field={field}
                  answer={answers[field.id] ?? ""}
                  error={fieldErrors[field.id]}
                  isSubmitting={isSubmitting}
                  onAnswerChange={updateAnswer}
                />
              ))}
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
