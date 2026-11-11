-- ============================================================================
-- FormFlow · 0002 · Server-side validation RPC
-- p_public_id is TEXT (matches forms.public_id).
-- ============================================================================

-- drop old uuid signature if it exists from a previous run
drop function if exists public.submit_form_response(uuid, jsonb);

create or replace function public.submit_form_response(
  p_public_id text,
  p_data jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_form   public.forms%rowtype;
  v_field  public.form_fields%rowtype;
  v_result uuid;
  v_ans    jsonb;
  v_text   text;
begin
  select * into v_form
  from public.forms
  where public_id = p_public_id and is_published = true;

  if not found then
    raise exception 'Form not found or not published' using errcode = 'P0001';
  end if;

  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'Response payload must be a JSON object' using errcode = '22P02';
  end if;

  if (select count(*) from jsonb_object_keys(p_data)) > 200 then
    raise exception 'Too many fields in response' using errcode = '22025';
  end if;

  for v_field in
    select * from public.form_fields where form_id = v_form.id
  loop
    v_ans := p_data -> v_field.id::text;

    if v_field.required and (
      v_ans is null
      or (
        jsonb_typeof(v_ans) = 'string'
        and btrim(v_ans #>> '{}') = ''
      )
    ) then
      raise exception 'Field "%" is required', v_field.label using errcode = '23514';
    end if;

    if v_ans is not null then
      if v_field.type in ('short_text', 'long_text') then
        if jsonb_typeof(v_ans) <> 'string' then
          raise exception 'Field "%" must be a text answer', v_field.label using errcode = '22P02';
        end if;
        v_text := v_ans #>> '{}';
        if length(v_text) > 10000 then
          raise exception 'Field "%" answer is too long', v_field.label using errcode = '22025';
        end if;

      elsif v_field.type = 'multiple_choice' then
        if jsonb_typeof(v_ans) <> 'string' then
          raise exception 'Field "%" must be a string option', v_field.label using errcode = '22P02';
        end if;
        v_text := v_ans #>> '{}';
        if v_field.options is not null and jsonb_typeof(v_field.options) = 'array' then
          if not exists (
            select 1 from jsonb_array_elements_text(v_field.options) as opt
            where opt = v_text
          ) then
            raise exception 'Field "%" has an invalid option', v_field.label using errcode = '23514';
          end if;
        end if;
      end if;
    end if;
  end loop;

  insert into public.responses (form_id, data)
  values (v_form.id, p_data)
  returning id into v_result;

  return v_result;
end;
$$;

grant execute on function public.submit_form_response(text, jsonb) to anon, authenticated;