/** @format */

import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../lib/supabaseClient";

function usePublicForm(publicId) {
  async function fetchPublicForm() {
    // Only fetch what anonymous visitors need — the form owner's user_id
    // and other internal columns never leave the database.
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("id, title, is_published")
      .eq("public_id", publicId)
      .eq("is_published", true)
      .single();

    if (formError) {
      throw new Error(formError.message);
    }

    const { data: fieldsData, error: fieldsError } = await supabase
      .from("form_fields")
      .select("id, form_id, type, label, required, options, order")
      .eq("form_id", formData.id)
      .order("order");

    if (fieldsError) {
      throw new Error(fieldsError.message);
    }

    return {
      form: formData,
      fields: fieldsData,
    };
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["publicForm", publicId],
    queryFn: fetchPublicForm,
    enabled: !!publicId,
  });

  return { data, isLoading, error };
}

export default usePublicForm;
