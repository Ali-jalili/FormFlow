/** @format */

import {
  ArrowLeft,
  Check,
  Edit3,
  Eye,
  Globe,
  GlobeOff,
  Loader2,
  Save,
} from "lucide-react";

function FormBuilderHeader({
  title,
  onTitleChange,
  onBack,
  onPreviewToggle,
  showPreview,
  onSave,
  onPublish,
  onUnpublish,
  isSaving,
  isPublishing,
  isUnpublishing,
  isPublished,
  isDirty,
  canPublish,
}) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            title="Go back"
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          <div className="hidden h-6 w-px bg-gray-200/80 sm:block" />

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                placeholder="Untitled Form"
                aria-label="Form title"
                className="min-w-0 w-full max-w-xs truncate rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-200 hover:bg-white focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:max-w-sm sm:text-base"
              />

              <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-gray-50 px-1.5 py-1 text-[10px] font-medium sm:px-2 sm:text-xs">
                {isDirty ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-700">Unsaved</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 text-emerald-600 sm:h-3.5 sm:w-3.5" />
                    <span className="text-emerald-700">Saved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onPreviewToggle}
            aria-label={showPreview ? "Switch to Editor" : "Switch to Preview"}
            title={showPreview ? "Switch to Editor" : "Switch to Preview"}
            className={`group flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 lg:hidden ${
              showPreview
                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {showPreview ? (
              <>
                <Edit3 className="h-4 w-4 text-indigo-600" />
                <span className="hidden xs:inline">Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="hidden xs:inline">Preview</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            title={!isDirty ? "No changes to save" : "Save your form"}
            className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-10 sm:text-sm"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            ) : (
              <Save className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:scale-105" />
            )}

            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing || !canPublish}
            title={
              !canPublish
                ? "Save your form before publishing"
                : "Publish your form"
            }
            className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-xs font-semibold text-white shadow-md shadow-indigo-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-10 sm:px-4 sm:text-sm"
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
            )}

            <span className="hidden sm:inline">
              {isPublishing ? "Publishing..." : "Publish"}
            </span>
          </button>

          {isPublished && (
            <button
              type="button"
              onClick={onUnpublish}
              disabled={isUnpublishing}
              title="Unpublish this form"
              className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-sm"
            >
              {isUnpublishing ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              ) : (
                <GlobeOff className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:scale-105" />
              )}

              <span className="hidden sm:inline">
                {isUnpublishing ? "Unpublishing..." : "Unpublish"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default FormBuilderHeader;
