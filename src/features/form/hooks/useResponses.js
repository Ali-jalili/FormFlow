/** @format */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

function useResponses(formId) {
  async function fetchResponses() {
    const { data, error } = await supabase
      .from("responses")
      .select("id, form_id, data, created_at")
      .eq("form_id", formId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["responses", formId],
    queryFn: fetchResponses,
    enabled: !!formId,
  });

  return { data, isLoading, error };
}

export default useResponses;
