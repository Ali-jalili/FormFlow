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

/**
 * Diff-based save using only INSERT and DELETE — deliberately no UPDATE or
 * upsert, because the database RLS policies only allow insert/delete on
 * form_fields. Unchanged fields keep their rows (stable ordering); changed
 * fields are re-created so their values are fresh.
 */
async function saveFormFields(formId, fields) {
  const existing = await getFormFields(formId);
  const existingById = new Map(existing.map((field) => [field.id, field]));

  const normalized = fields.map((field) => ({
    id: field.id,
    form_id: formId,
    type: field.type,
    label: field.label,
    required: field.required,
    options: normalizeOptions(field),
    order: field.order,
  }));

  const nextIds = new Set(normalized.map((field) => field.id));

  // 1) Fields removed from the builder.
  const removedIds = existing
    .filter((field) => !nextIds.has(field.id))
    .map((field) => field.id);

  // 2) Existing fields whose content changed (re-create them, since the DB
  //    has no UPDATE policy for form_fields).
  const changed = normalized.filter((field) => {
    const old = existingById.get(field.id);
    if (!old) return false;

    return (
      old.type !== field.type ||
      old.label !== field.label ||
      old.required !== field.required ||
      old.order !== field.order ||
      JSON.stringify(normalizeOptions(old)) !== JSON.stringify(field.options)
    );
  });

  // 3) Brand-new fields.
  const fresh = normalized.filter((field) => !existingById.has(field.id));

  const toDelete = [...removedIds, ...changed.map((field) => field.id)];
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("form_fields")
      .delete()
      .eq("form_id", formId)
      .in("id", toDelete);

    if (deleteError) throw new Error(deleteError.message);
  }

  const toInsert = [...changed, ...fresh];
  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from("form_fields")
      .insert(toInsert)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  // Nothing to insert — return the fields that survive.
  return existing.filter((field) => nextIds.has(field.id));
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
