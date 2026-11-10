-- ============================================================================
-- FormFlow · 0002 · Server-side validation RPC
-- Provides `submit_form_response` which validates a submission against the
-- form's current fields (required, type, size) inside a single transaction.
-- The client still calls `supabase.from("responses").insert(...)` as a
-- fallback, but for a resilient production setup you would swap the client
-- call to `supabase.rpc("submit_form_response", {...})` — the RPC enforces
-- rules the client cannot.
-- ============================================================================

create or replace function public.submit_form_response(
  p_public_id uuid,
  p_data jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_form   public.forms%rowtype;
  v_fields public.form_fields%rowtype;
  v_result uuid;
  v_ans    jsonb;
  v_err    text;
begin
  -- Load the form (must be published + public).
  select * into v_form
  from public.forms
  where public_id = p_public_id and is_published = true;

  if not found then
    raise exception 'Form not found or not published' using errcode = 'P0001';
  end if;

  -- Basic payload guards.
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'Response payload must be a JSON object' using errcode = '22P02';
  end if;

  if (select count(*) from jsonb_object_keys(p_data)) > 200 then
    raise exception 'Too many fields in response' using errcode = '22025';
  end if;

  -- Validate against each known field.
  for v_fields in
    select * from public.form_fields where form_id = v_form.id
  loop
    begin
      v_ans := p_data -> v_fields.id::text;
    exception when others then
      v_ans := null;
    end;

    if v_fields.required and (v_ans is null or v_ans = '""'::jsonb) then
      raise exception 'Field "%" is required' using errcode = '23514';
    end if;

    if v_ans is not null then
      if v_fields.type in ('short_text', 'long_text') then
        if jsonb_typeof(v_ans) <> 'string' then
          raise exception 'Field "%" must be a text answer' using errcode = '22P02';
        end if;
        if length(v_ans::text) > 10000 then
          raise exception 'Field "%" answer is too long' using errcode = '22025';
        end if;
      end if;
    end if;
  end loop;

  -- Insert the response.
  insert into public.responses (form_id, data)
  values (v_form.id, p_data)
  returning id into v_result;

  return v_result;
end;
$$;

grant execute on function public.submit_form_response(uuid, jsonb) to anon, authenticated;
