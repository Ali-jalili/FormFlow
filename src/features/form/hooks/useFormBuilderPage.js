/** @format */

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useAuth from "../../Auth/useAuth";
import useFormData from "./useFormData";
import useFormFields from "./useFormFields";
import useFormDraft from "./useFormDraft";
import useSaveForm from "./useSaveForm";
import usePublishForm from "./usePublishForm";
import useUnpublishForm from "./useUnpublishForm";
import usePublishedFormBanner from "./usePublishedFormBanner";
import {
  DEFAULT_FORM_VALUES,
  isDraftDifferentFromServer,
} from "../utils/formBuilder.utils";

function useFormBuilderPage() {
  const { formId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPreview, setShowPreview] = useState(false);
  const formMethods = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });
  const {
    control,
    reset,
    getValues,
    formState: { isDirty },
  } = formMethods;
  const title = useWatch({ control, name: "title" });
  const fields = useWatch({ control, name: "fields" });
  const { data: formData, isLoading: formLoading } = useFormData(formId);
  const {
    data: fieldsData,
    isLoading: fieldsLoading,
    isFetched: fieldsFetched,
  } = useFormFields(formId);
  const { clearDraft, getDraft } = useFormDraft(
    formId,
    control,
    !!formData && fieldsFetched,
    user?.id,
  );

  const isFormSavedInDb = useMemo(
    () =>
      !!formData &&
      (formData.title !== "Untitled Form" ||
        (fieldsData && fieldsData.length > 0)),
    [formData, fieldsData],
  );

  const draftNotifiedRef = useRef(false);
  const serverValues = {
    title: formData?.title || "",
    fields: fieldsData || [],
  };
  const isDraftActive = Boolean(
    formId &&
      fieldsFetched &&
      formData &&
      isDraftDifferentFromServer(getDraft(), serverValues),
  );
  const { publishedUrl, dismissPublishedBanner } = usePublishedFormBanner(
    formId,
    formData,
  );

  useEffect(() => {
    if (!formId || !fieldsFetched || !formData) return;

    const latestServerValues = {
      title: formData.title || "",
      fields: fieldsData || [],
    };
    const draft = getDraft();

    if (isDraftDifferentFromServer(draft, latestServerValues)) {
      reset(draft);

      // Make stale drafts visible instead of silently winning over the
      // server state (which may have changed on another device).
      if (!draftNotifiedRef.current) {
        draftNotifiedRef.current = true;
        toast(
          "A local draft was restored. Review it before saving — it may be out of date.",
          { icon: "📝" },
        );
      }
      return;
    }

    clearDraft();
    reset(latestServerValues);
  }, [
    formId,
    fieldsFetched,
    formData,
    fieldsData,
    getDraft,
    reset,
    clearDraft,
  ]);

  useEffect(() => {
    return () => {
      const draft = getDraft();

      if (
        !draft ||
        !user ||
        !formId ||
        !draft.title ||
        draft.title === formData?.title
      ) {
        return;
      }

      queryClient.setQueryData(["forms", user.id], (old) =>
        old?.map((form) =>
          form.id === formId ? { ...form, title: draft.title } : form,
        ),
      );
    };
  }, [getDraft, formData?.title, formId, queryClient, user]);

  const { mutateAsync: saveForm, isPending: isSaving } = useSaveForm(formId);
  const { mutateAsync: publish, isPending: isPublishing } =
    usePublishForm(formId);
  const { mutateAsync: unpublish, isPending: isUnpublishing } =
    useUnpublishForm(formId);
  const hasUnsavedChanges = isDirty || isDraftActive;
  const showUnsaved = !isFormSavedInDb || hasUnsavedChanges;
  const canPublish =
    fields.length > 0 && !hasUnsavedChanges && isFormSavedInDb && !isPublishing;

  async function handleSave() {
    const values = getValues();

    try {
      await saveForm(values);
      clearDraft();
      reset(values);
      toast.success("Form saved successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to save form: ${error.message}`
          : "Failed to save form. Please try again.",
      );
    }
  }

  async function handlePublish() {
    const values = getValues();

    if (!values.fields.length) {
      toast.error("Add at least one field before publishing.");
      return;
    }

    if (hasUnsavedChanges) {
      toast.error("Save your form before publishing.");
      return;
    }

    try {
      await publish();
      clearDraft();
      toast.success("Form published successfully!");
    } catch {
      toast.error("Failed to publish form.");
    }
  }

  async function handleUnpublish() {
    try {
      await unpublish();
      toast.success("Form unpublished. The public link is now inactive.");
    } catch {
      toast.error("Failed to unpublish form.");
    }
  }

  const isPublished = !!formData?.is_published && !!formData?.public_id;

  return {
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
  };
}

export default useFormBuilderPage;
