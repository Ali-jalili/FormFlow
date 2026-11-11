/** @format */

import { FORM_FIELD_TYPES } from "../utils/form.constants";

function PublicFormField({
  field,
  answer,
  error,
  isSubmitting,
  onAnswerChange,
}) {
  return (
    <div
      id={`field-card-${field.id}`}
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
            {field.required && <span className="ml-1 text-rose-500">*</span>}
          </span>
          {field.required && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Required
            </span>
          )}
        </label>
        {error && (
          <p
            id={`field-error-${field.id}`}
            role="alert"
            className="mt-1.5 text-xs font-medium text-rose-600"
          >
            {error}
          </p>
        )}
      </div>

      {/* Short text */}
      {field.type === FORM_FIELD_TYPES.SHORT_TEXT && (
        <input
          id={`field-${field.id}`}
          aria-describedby={error ? `field-error-${field.id}` : undefined}
          value={answer}
          onChange={(e) => onAnswerChange(field.id, e.target.value)}
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
          aria-describedby={error ? `field-error-${field.id}` : undefined}
          value={answer}
          onChange={(e) => onAnswerChange(field.id, e.target.value)}
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
              const selected = answer === opt;

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
                    onChange={() => onAnswerChange(field.id, opt)}
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
}

export default PublicFormField;
