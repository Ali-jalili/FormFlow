/** @format */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

const RESPONSE_PAGE_SIZE = 20;

function useResponses(formId, page = 0, searchTerm = "") {
  async function fetchResponses({ signal }) {
    const { data, error } = await supabase
      .rpc("get_form_responses_page", {
        p_form_id: formId,
        p_page: page,
        p_page_size: RESPONSE_PAGE_SIZE,
        p_search: searchTerm.trim(),
      })
      .abortSignal(signal);

    if (error) throw new Error(error.message);
    return data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["responses", formId, page, searchTerm.trim()],
    queryFn: fetchResponses,
    enabled: !!formId,
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.responses,
    count: data?.count ?? 0,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    error,
  };
}

export { RESPONSE_PAGE_SIZE };
export default useResponses;
