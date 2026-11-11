/** @format */

import { useState } from "react";
import toast from "react-hot-toast";

import { submitResponse } from "../services/responsesService";
import { FORM_FIELD_TYPES } from "../utils/form.constants";

/**
 * Owns all submission state + validation for a public form.
 * Kept separate from the view so it is directly unit-testable.
 */
function usePublicFormSubmit(publicId, fields) {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  function updateAnswer(fieldId, value) {
    setAnswers((current) => ({ ...current, [fieldId]: value }));

    // Clear the inline error for a field the moment the user answers it.
    setFieldErrors((current) => {
      if (!current[fieldId]) return current;
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  }

  function validateAnswers() {
    if (!fields?.length) {
      setSubmitError("This form has no fields to answer.");
      return false;
    }

    const errors = {};

    for (const field of fields) {
      const answer = answers[field.id];

      if (
        field.type === FORM_FIELD_TYPES.MULTIPLE_CHOICE &&
        answer !== undefined
      ) {
        // A stored answer must correspond to one of the form's options,
        // mirroring the RPC's "invalid option" check on the server.
        const valid = (field.options || []).some(
          (opt) => opt && opt.trim() !== "" && opt === answer,
        );
        if (!valid) {
          errors[field.id] =
            `${field.label || "This field"} has an invalid option`;
        }
        continue;
      }

      if (!field.required) continue;

      if (!answer || (typeof answer === "string" && answer.trim() === "")) {
        errors[field.id] = `${field.label || "This field"} is required`;
      }
    }

    const hasAnyAnswer = Object.values(answers).some((answer) => {
      if (typeof answer === "string") return answer.trim() !== "";
      return answer !== null && answer !== undefined;
    });

    if (!hasAnyAnswer) {
      setSubmitError("Please answer at least one question.");
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0 && hasAnyAnswer;
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (!validateAnswers()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // The RPC validates server-side and returns the new response id.
      await submitResponse(publicId, answers);

      toast.success("Response submitted!");

      setIsSubmitted(true);
      setAnswers({});
      setFieldErrors({});
    } catch (error) {
      setSubmitError(
        error?.message || "Failed to submit response. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    answers,
    isSubmitted,
    isSubmitting,
    fieldErrors,
    submitError,
    updateAnswer,
    handleSubmit,
  };
}

export default usePublicFormSubmit;
