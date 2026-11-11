/** @format */

import { Circle } from "lucide-react";
import { FORM_FIELD_TYPES } from "../utils/form.constants";

function FormPreviewField({ field }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label || "Untitled Field"}

        {field.required && (
          <span className="ml-1 text-rose-500" aria-label="required">
            *
          </span>
        )}
      </label>

      {field.type === FORM_FIELD_TYPES.SHORT_TEXT && (
        <input
          type="text"
          disabled
          placeholder="Short text answer"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-400"
        />
      )}

      {field.type === FORM_FIELD_TYPES.LONG_TEXT && (
        <textarea
          disabled
          rows={4}
          placeholder="Long text answer"
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-400"
        />
      )}

      {field.type === FORM_FIELD_TYPES.MULTIPLE_CHOICE && (
        <div className="space-y-2">
          {field.options
            ?.filter((option) => option?.trim())
            .map((option, index) => (
              <div
                key={`${field.id}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
              >
                <Circle
                  className="h-4 w-4 flex-shrink-0 text-gray-300"
                  aria-hidden="true"
                />

                <span className="text-sm text-gray-500">{option}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default FormPreviewField;
