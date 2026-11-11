import { Link } from "react-router-dom";
import { BarChart3, Clock, Edit3, ExternalLink, Trash2 } from "lucide-react";

function FormCardActions({ dataForm, isPublished, onOpenPublicForm, onOpenResponses, onDelete, isDeleting }) {
  return (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3.5">
          {/* Public Link Action */}
          <div>
            {isPublished && dataForm.public_id ? (
              <button
                type="button"
                onClick={onOpenPublicForm}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  px-2
                  py-1
                  text-xs
                  font-semibold
                  text-indigo-600
                  transition-all
                  duration-200
                  hover:bg-indigo-50
                  hover:text-indigo-700
                  active:scale-95
                "
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View form
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Clock className="h-3 w-3" />
                Not published
              </span>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <Link
              to={`/builder/${dataForm.id}`}
              aria-label="Edit form"
              title="Edit form"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition-all
                duration-200
                hover:bg-slate-100
                hover:text-indigo-600
                active:scale-95
              "
            >
              <Edit3 className="h-4 w-4" />
            </Link>

            {/* View Responses Button */}
            {isPublished && (
              <button
                type="button"
                onClick={onOpenResponses}
                aria-label="View responses"
                title="View responses"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-emerald-50
                  hover:text-emerald-600
                  active:scale-95
                "
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              aria-label="Delete form"
              title="Delete form"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition-all
                duration-200
                hover:bg-rose-50
                hover:text-rose-600
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
  );
}

export default FormCardActions;
