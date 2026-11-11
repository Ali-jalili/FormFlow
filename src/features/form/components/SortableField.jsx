/** @format */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Circle, GripVertical, Trash2, X, Plus } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";

import { FORM_FIELD_TYPES } from "../utils/form.constants";

function SortableField({ field, index, onRemove, isOverlay = false }) {
  const { control } = useFormContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    disabled: isOverlay,
  });

  const labelField = useController({
    name: `fields.${index}.label`,
    control,
  });

  const requiredField = useController({
    name: `fields.${index}.required`,
    control,
  });

  const optionsField = useController({
    name: `fields.${index}.options`,
    control,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleOptionChange(optionIndex, value) {
    const options = [...(optionsField.field.value || [])];
    options[optionIndex] = value;
    optionsField.field.onChange(options);
  }

  function handleRemoveOption(optionIndex) {
    const options = (optionsField.field.value || []).filter(
      (_, currentIndex) => currentIndex !== optionIndex,
    );
    optionsField.field.onChange(options);
  }

  function handleAddOption() {
    const options = optionsField.field.value || [];
    optionsField.field.onChange([...options, ""]);
  }

  const fieldTypeLabel = {
    [FORM_FIELD_TYPES.SHORT_TEXT]: "Short answer",
    [FORM_FIELD_TYPES.LONG_TEXT]: "Long answer",
    [FORM_FIELD_TYPES.MULTIPLE_CHOICE]: "Multiple choice",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md sm:p-4 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag field"
          style={{ touchAction: "none" }}
          className="mt-1 cursor-grab rounded-lg p-1 text-gray-300 transition-colors hover:bg-indigo-50 hover:text-indigo-400 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-indigo-50 px-1.5 text-[11px] font-semibold text-indigo-600">
                {index + 1}
              </span>

              <span className="rounded-full bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500">
                {fieldTypeLabel[field.type] || "Field"}
              </span>
            </div>

            <button
              type="button"
              onClick={onRemove}
              aria-label="Delete field"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Question
            </label>

            <input
              type="text"
              placeholder="What would you like to ask?"
              {...labelField.field}
              className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-indigo-500 placeholder:text-gray-400"
            />
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={requiredField.field.value || false}
              onChange={(event) =>
                requiredField.field.onChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span>Required question</span>
          </label>

          {field.type === FORM_FIELD_TYPES.MULTIPLE_CHOICE && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Answer options
              </div>

              <div className="space-y-1.5">
                {(optionsField.field.value || []).map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="group/option flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-gray-50"
                  >
                    <Circle className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />

                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(optionIndex, event.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="min-w-0 flex-1 border-0 bg-transparent py-1 text-sm text-gray-600 outline-none placeholder:text-gray-300 focus:text-gray-900"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveOption(optionIndex)}
                      aria-label={`Remove option ${optionIndex + 1}`}
                      className="rounded-md p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-500 opacity-100 sm:opacity-0 sm:group-hover/option:opacity-100 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add option
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SortableField;
