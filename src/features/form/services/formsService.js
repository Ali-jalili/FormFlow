/** @format */

import { supabase } from "../../../lib/supabaseClient";

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

async function saveFormFields(formId, fields) {
  // Compute the diff so we never wipe-and-recreate every field on each save.
  // This makes saves safe: a failed insert can't silently drop existing
  // fields, and unchanged fields keep their stored rows (stable ordering).
  const existing = await getFormFields(formId);

  const normalized = fields.map((field) => ({
    id: field.id,
    form_id: formId,
    type: field.type,
    label: field.label,
    required: field.required,
    options:
      field.type === "multiple_choice"
        ? (field.options || []).filter((opt) => opt && opt.trim() !== "")
        : field.options,
    order: field.order,
  }));

  const nextIds = new Set(normalized.map((field) => field.id));

  // 1) Delete fields that no longer exist in the builder.
  const toDelete = existing.filter((field) => !nextIds.has(field.id));
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("form_fields")
      .delete()
      .eq("form_id", formId)
      .in(
        "id",
        toDelete.map((field) => field.id),
      );

    if (deleteError) throw new Error(deleteError.message);
  }

  // 2) Upsert new + changed fields (updates keep the same row and ordering).
  if (normalized.length > 0) {
    const { data, error } = await supabase
      .from("form_fields")
      .upsert(normalized, { onConflict: "id" })
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  return [];
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

async function updateFormTitle(formId, title) {
  const { error } = await supabase
    .from("forms")
    .update({ title })
    .eq("id", formId);
  if (error) throw new Error(error.message);
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
  const cleaned = {};

  for (const [key, value] of Object.entries(answers || {})) {
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

async function submitResponse(formId, answers) {
  const data = sanitizeAnswers(answers);

  const { error } = await supabase.from("responses").insert({
    form_id: formId,
    data,
  });

  if (error) throw new Error(error.message);
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
  saveFormFields,
  getFormsByUser,
  getForm,
  getFormFields,
  updateFormTitle,
  publishForm,
  unpublishForm,
  submitResponse,
  deleteForm,
};
