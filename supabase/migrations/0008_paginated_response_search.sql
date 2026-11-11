-- Server-side response pagination and search for the authenticated form owner.
-- SECURITY INVOKER preserves the responses and form_fields RLS policies.
create or replace function public.get_form_responses_page(
  p_form_id uuid,
  p_page integer default 0,
  p_page_size integer default 20,
  p_search text default ''
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_result jsonb;
  v_search text := lower(btrim(coalesce(p_search, '')));
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_page is null
     or p_page_size is null
     or p_page < 0
     or p_page_size < 1
     or p_page_size > 100 then
    raise exception 'Invalid response page requested' using errcode = '22023';
  end if;

  with all_responses as (
    select id, form_id, data, created_at
    from public.responses
    where form_id = p_form_id
  ),
  filtered_responses as (
    select response.*
    from all_responses response
    where case
      when v_search = '' then true
      when jsonb_typeof(response.data) <> 'object' then false
      else exists (
        select 1
        from jsonb_each_text(response.data) answer(key, value)
        left join public.form_fields field
          on field.id::text = answer.key
         and field.form_id = response.form_id
        where position(v_search in lower(coalesce(field.label, answer.key))) > 0
           or position(v_search in lower(answer.value)) > 0
      )
    end
  ),
  page_rows as (
    select *
    from filtered_responses
    order by created_at desc, id desc
    offset p_page * p_page_size
    limit p_page_size
  )
  select jsonb_build_object(
    'responses',
    coalesce(
      (select jsonb_agg(to_jsonb(page_rows) order by created_at desc, id desc)
       from page_rows),
      '[]'::jsonb
    ),
    'count',
    (select count(*) from filtered_responses),
    'totalCount',
    (select count(*) from all_responses)
  )
  into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_form_responses_page(uuid, integer, integer, text)
  from public;
revoke all on function public.get_form_responses_page(uuid, integer, integer, text)
  from anon;
grant execute on function public.get_form_responses_page(uuid, integer, integer, text)
  to authenticated;
