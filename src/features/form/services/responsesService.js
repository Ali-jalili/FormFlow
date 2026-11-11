import { supabase } from "../../../lib/supabaseClient";
import { sanitizeAnswers } from "../utils/responseValidation";

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

/** Submissions use the transactional RPC for server-side validation. */
async function submitResponse(publicId, answers) {
  const data = sanitizeAnswers(answers);
  const { data: responseId, error } = await supabase.rpc(
    "submit_form_response",
    { p_public_id: publicId, p_data: data },
  );

  if (error) throw new Error(error.message);
  return responseId;
}

export { getAllResponses, submitResponse };
