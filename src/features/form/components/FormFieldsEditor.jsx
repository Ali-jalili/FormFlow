/** @format */

import { useMemo, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableField from "./SortableField";
import AddFieldSelect from "./AddFieldSelect";
import { FORM_FIELD_TYPES } from "../utils/form.constants";
import { LayoutGrid, Layers } from "lucide-react";

export default function FormFieldsEditor() {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fieldIds = useMemo(() => fields.map((field) => field.id), [fields]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  const handleAddField = (type) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: "",
      required: false,
      options: type === FORM_FIELD_TYPES.MULTIPLE_CHOICE ? ["", ""] : [],
    };
    append(newField);
  };

  const activeField = useMemo(
    () => fields.find((f) => f.id === activeId),
    [activeId, fields],
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <LayoutGrid className="h-4 w-4 text-indigo-600" />
            Add Field
          </label>
          <span className="text-xs font-medium text-slate-400">
            {fields.length} {fields.length === 1 ? "field" : "fields"} added
          </span>
        </div>
        <AddFieldSelect onAddField={handleAddField} />
        <p className="mt-2 text-xs text-slate-400">
          Drag questions to change their order. Your changes are saved as a
          local draft until you save.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fieldIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {fields.map((field, index) => (
              <SortableField
                key={field.id}
                field={field}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeField ? (
            <div className="opacity-90 shadow-2xl ring-2 ring-indigo-500/50 rounded-2xl bg-white">
              <SortableField
                field={activeField}
                index={fields.findIndex((f) => f.id === activeId)}
                onRemove={() => {}}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-4 py-12 text-center transition-all hover:bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No fields added yet
          </h3>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            Select a field type from the panel above to start building your
            form.
          </p>
        </div>
      )}

      {fields.length > 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4">
          <p className="mb-3 text-center text-xs text-slate-500">
            Need another question? Add it here without scrolling back up.
          </p>
          <AddFieldSelect onAddField={handleAddField} />
        </div>
      )}
    </div>
  );
}
