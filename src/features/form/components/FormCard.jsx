/** @format */

import { useNavigate } from "react-router-dom";
import DeleteFormModal from "../../../components/ui/DeleteFormModal";
import FormCardActions from "./FormCardActions";
import useDeleteForm from "../hooks/useDeleteForm";
import { Calendar, CheckCircle2, FileText } from "lucide-react";
import { useState } from "react";

function FormCard({ dataForm }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutateAsync: confirmDelete, isPending: isDeleting } = useDeleteForm(
    dataForm.id,
  );

  const isPublished = dataForm.is_published;

  const formattedDate = new Date(dataForm.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  function handleDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm() {
    try {
      await confirmDelete();
      setShowDeleteModal(false);
    } catch {
      // The mutation reports failures through its onError callback.
    }
  }

  function handleResponses(event) {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/responses/${dataForm.id}`);
  }

  function handlePublicForm(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!dataForm.public_id) return;

    window.open(`/form/${dataForm.public_id}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <article
        className="
          group
          relative
          flex
          min-h-[195px]
          flex-col
          justify-between
          rounded-2xl
          border
          border-slate-200/80
          bg-white
          p-5
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-slate-300
          hover:shadow-xl
          hover:shadow-slate-200/50
        "
      >
        {/* Top Header Section */}
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            {/* Form status icon */}
            <div
              className={`
                flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300
                ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10 group-hover:scale-105"
                    : "bg-amber-50/80 text-amber-600 ring-1 ring-amber-500/10 group-hover:scale-105"
                }
              `}
            >
              {isPublished ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>

            {/* Status Badge */}
            <span
              className={`
                inline-flex items-center gap-1.5
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                tracking-wide
                transition-all
                ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                }
              `}
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}
                `}
              />
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {/* Form Title */}
          <h3
            className="
              mb-1.5
              truncate
              text-base
              font-bold
              text-slate-900
              transition-colors
              duration-200
              group-hover:text-indigo-600
            "
            title={dataForm.title || "Untitled Form"}
          >
            {dataForm.title || "Untitled Form"}
          </h3>

          {/* Created Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Created {formattedDate}</span>
          </div>
        </div>

        {/* Footer Actions Section */}
        <FormCardActions dataForm={dataForm} isPublished={isPublished} onOpenPublicForm={handlePublicForm} onOpenResponses={handleResponses} onDelete={handleDelete} isDeleting={isDeleting} />
      </article>

      {/* Delete confirmation modal */}
      <DeleteFormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        formTitle={dataForm.title}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default FormCard;
