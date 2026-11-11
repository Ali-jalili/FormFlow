-- Save the form title and fields as one transaction.
-- SECURITY INVOKER keeps the existing forms/form_fields RLS policies in force.
create or replace function public.save_form_draft(
  p_form_id uuid,
  p_title text,
  p_fields jsonb
)
returns setof public.form_fields
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select user_id into v_owner_id
  from public.forms
  where id = p_form_id;

  if not found or v_owner_id <> auth.uid() then
    raise exception 'Form not found or access denied' using errcode = '42501';
  end if;

  if p_fields is null or jsonb_typeof(p_fields) <> 'array' then
    raise exception 'Form fields must be a JSON array' using errcode = '22023';
  end if;

  update public.forms
  set title = p_title
  where id = p_form_id;

  delete from public.form_fields
  where form_id = p_form_id;

  insert into public.form_fields (
    id,
    form_id,
    type,
    label,
    required,
    options,
    "order"
  )
  select
    field.id,
    p_form_id,
    field.type,
    coalesce(field.label, ''),
    coalesce(field.required, false),
    field.options,
    coalesce(field."order", 0)
  from jsonb_to_recordset(p_fields) as field(
    id uuid,
    type text,
    label text,
    required boolean,
    options jsonb,
    "order" integer
  );

  return query
  select *
  from public.form_fields
  where form_id = p_form_id
  order by "order";
end;
$$;

revoke all on function public.save_form_draft(uuid, text, jsonb) from public;
revoke all on function public.save_form_draft(uuid, text, jsonb) from anon;
grant execute on function public.save_form_draft(uuid, text, jsonb) to authenticated;
