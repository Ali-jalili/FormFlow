import { useState } from "react";

function usePublishedFormBanner(formId, formData) {
  const [dismissedPublicId, setDismissedPublicId] = useState(null);
  const storageKey = `published-banner-dismissed-${formId}`;
  const isDismissed =
    formData?.public_id &&
    (dismissedPublicId === formData.public_id ||
      localStorage.getItem(storageKey) === formData.public_id);
  const publishedUrl =
    formData?.is_published && formData?.public_id && !isDismissed
      ? `${window.location.origin}/form/${formData.public_id}`
      : null;

  function dismissPublishedBanner() {
    if (formId && formData?.public_id) {
      localStorage.setItem(storageKey, formData.public_id);
      setDismissedPublicId(formData.public_id);
    }
  }

  return { publishedUrl, dismissPublishedBanner };
}

export default usePublishedFormBanner;
