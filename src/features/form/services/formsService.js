/** @format */

import { supabase } from "../../../lib/supabaseClient";
import { FORM_FIELD_TYPES } from "../utils/form.constants";

async function createForm(userId) {
  const { data, error } = await supabase
    .from("forms")
    .insert({
      user_id: userId,
      title: "Untitled Form",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

function normalizeOptions(field) {
  if (field.type === FORM_FIELD_TYPES.MULTIPLE_CHOICE) {
    return (field.options || []).filter((opt) => opt && opt.trim() !== "");
  }
  return null;
}

async function saveFormDraft(formId, title, fields) {
  const normalized = (fields || []).map((field, index) => ({
    id: field.id,
    type: field.type,
    label: field.label,
    required: field.required,
    options: normalizeOptions(field),
    order: index + 1,
  }));

  const { data, error } = await supabase.rpc("save_form_draft", {
    p_form_id: formId,
    p_title: title,
    p_fields: normalized,
  });

  if (error) throw new Error(error.message);
  return data;
}

async function getFormsByUser(userId) {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

async function getForm(formId) {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function getFormFields(formId) {
  const { data, error } = await supabase
    .from("form_fields")
    .select("id, form_id, type, label, required, options, order")
    .eq("form_id", formId)
    .order("order");

  if (error) throw new Error(error.message);

  return data;
}

async function getAllResponses(formId) {
  const pageSize = 1000;
  const responses = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("responses")
      .select("id, form_id, data, created_at")
      .eq("form_id", formId)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);

    responses.push(...data);
    if (data.length < pageSize) return responses;
    offset += pageSize;
  }
}

async function publishForm(formId) {
  // Reuse the existing public_id when available so previously shared
  // links never break on re-publish.
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("public_id")
    .eq("id", formId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const publicId = form?.public_id || crypto.randomUUID();

  const { error } = await supabase
    .from("forms")
    .update({ is_published: true, public_id: publicId })
    .eq("id", formId);

  if (error) throw new Error(error.message);
  return publicId;
}

async function unpublishForm(formId) {
  const { error } = await supabase
    .from("forms")
    .update({ is_published: false })
    .eq("id", formId);

  if (error) throw new Error(error.message);
}

const MAX_ANSWER_KEYS = 100;
const MAX_ANSWER_LENGTH = 10_000;

/**
 * Client-side guard rails before hitting the table.
 * (Real server-side validation is provided by the `submit_form_response`
 * RPC — see supabase/migrations.)
 */
function sanitizeAnswers(answers) {
  if (answers === null || answers === undefined || Array.isArray(answers)) {
    throw new Error("Answers must be an object keyed by field id.");
  }

  const cleaned = {};

  for (const [key, value] of Object.entries(answers)) {
    if (typeof key !== "string" || key.length > 64) continue;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") cleaned[key] = trimmed.slice(0, MAX_ANSWER_LENGTH);
    } else if (value !== null && value !== undefined) {
      cleaned[key] = String(value).slice(0, MAX_ANSWER_LENGTH);
    }
  }

  const keys = Object.keys(cleaned);

  if (keys.length === 0) {
    throw new Error("No answers to submit.");
  }

  // Guard against oversized payloads / spam.
  if (keys.length > MAX_ANSWER_KEYS) {
    throw new Error("Too many answers in this response.");
  }

  return cleaned;
}

/**
 * Submissions go through the `submit_form_response` RPC
 * (supabase/migrations/0002_validation_rpc.sql) — the only sanctioned
 * write path for responses. Server-side validation (required fields,
 * answer types, size limits) runs inside a single Postgres transaction.
 */
async function submitResponse(publicId, answers) {
  const data = sanitizeAnswers(answers);

  const { data: responseId, error } = await supabase.rpc(
    "submit_form_response",
    {
      p_public_id: publicId,
      p_data: data,
    },
  );

  if (error) throw new Error(error.message);
  return responseId;
}

async function deleteForm(formId) {
  const { data, error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export {
  createForm,
  saveFormDraft,
  getFormsByUser,
  getForm,
  getFormFields,
  getAllResponses,
  publishForm,
  unpublishForm,
  submitResponse,
  deleteForm,
  sanitizeAnswers,
  MAX_ANSWER_KEYS,
  MAX_ANSWER_LENGTH,
};
