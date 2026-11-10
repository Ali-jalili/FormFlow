/** @format */

import { useCallback, useEffect, useMemo } from "react";

function useFormDraft(formId, watch, enabled = false, namespace) {
  // Namespacing by the signed-in user keeps drafts of different accounts
  // on the same browser from ever leaking into each other.
  const draftKey = useMemo(
    () => (formId ? `form-draft-${namespace ?? ""}-${formId}` : null),
    [formId, namespace],
  );

  const getDraft = useCallback(() => {
    if (!draftKey) return null;

    const draft = localStorage.getItem(draftKey);

    if (!draft) return null;

    try {
      return JSON.parse(draft);
    } catch {
      return null;
    }
  }, [draftKey]);

  const formValues = watch();

  useEffect(() => {
    if (!draftKey || !enabled) return;

    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(formValues));
    }, 500);

    return () => clearTimeout(timer);
  }, [draftKey, formValues, enabled]);

  const clearDraft = useCallback(() => {
    if (!draftKey) return;

    localStorage.removeItem(draftKey);
  }, [draftKey]);

  return {
    clearDraft,
    getDraft,
  };
}

export default useFormDraft;
