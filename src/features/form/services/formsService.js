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
  publishForm,
  unpublishForm,
  deleteForm,
};
