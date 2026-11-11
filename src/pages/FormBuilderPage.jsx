/** @format */

import { FormProvider } from "react-hook-form";

import useFormBuilderPage from "../features/form/hooks/useFormBuilderPage";
import FormBuilderHeader from "../features/form/components/FormBuilderHeader";
import PublishedFormBanner from "../features/form/components/PublishedFormBanner";
import FormFieldsEditor from "../features/form/components/FormFieldsEditor";
import FormPreview from "../features/form/components/FormPreview";
import Spinner from "../components/ui/Spinner";

function FormBuilderPage() {
  const {
    formId,
    formMethods,
    title,
    formLoading,
    fieldsLoading,
    showPreview,
    setShowPreview,
    publishedUrl,
    dismissPublishedBanner,
    handleSave,
    handlePublish,
    handleUnpublish,
    navigate,
    isSaving,
    isPublishing,
    isUnpublishing,
    isPublished,
    showUnsaved,
    canPublish,
  } = useFormBuilderPage();

  if ((fieldsLoading || formLoading) && formId) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <FormBuilderHeader
          title={title}
          onTitleChange={(newTitle) =>
            formMethods.setValue("title", newTitle, {
              shouldDirty: true,
            })
          }
          onBack={() => navigate(-1)}
          onPreviewToggle={() => setShowPreview((current) => !current)}
          showPreview={showPreview}
          onSave={formMethods.handleSubmit(handleSave)}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          isSaving={isSaving}
          isPublishing={isPublishing}
          isUnpublishing={isUnpublishing}
          isPublished={isPublished}
          isDirty={showUnsaved}
          canPublish={canPublish}
        />

        <PublishedFormBanner
          publishedUrl={publishedUrl}
          onDismiss={dismissPublishedBanner}
        />

        <main className="relative flex min-h-0 flex-1 overflow-hidden">
          <div
            className={`
              w-full flex-1 overflow-y-auto transition-all duration-300 lg:block lg:w-1/2 lg:border-r lg:border-slate-200/80
              ${showPreview ? "hidden" : "block"}
            `}
          >
            <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
              <FormFieldsEditor />
            </div>
          </div>

          <div
            className={`
              w-full flex-1 overflow-y-auto bg-slate-50 transition-all duration-300 lg:block lg:w-1/2
              ${showPreview ? "block" : "hidden"}
            `}
          >
            <FormPreview />
          </div>
        </main>
      </div>
    </FormProvider>
  );
}

export default FormBuilderPage;
