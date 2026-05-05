-- ============================================================================
-- Bootstrap your first admin.
--
-- Workflow:
--   1. In Supabase Dashboard → Authentication → Users → "Add user"
--      Create a user with the email you want to use to log in to /admin.
--      (Set "Auto confirm user" so you can sign in immediately.)
--   2. Set the variable below to that email and run THIS file in
--      Supabase Dashboard → SQL Editor.
--
-- Re-running is safe — ON CONFLICT keeps the existing role.
-- ============================================================================

do $$
declare
  v_email text := 'CHANGE_ME@example.com';   -- ← set me before running
  v_user_id uuid;
begin
  if v_email = 'CHANGE_ME@example.com' then
    raise notice 'Skipping bootstrap: edit v_email in 0004_bootstrap_admin.sql first.';
    return;
  end if;

  select id into v_user_id from auth.users where email = v_email limit 1;

  if v_user_id is null then
    raise exception 'No auth.users row found for %. Create the user in Supabase Auth first.', v_email;
  end if;

  insert into public.admin_profiles (user_id, email, role)
  values (v_user_id, v_email, 'admin')
  on conflict (user_id) do update
    set email = excluded.email,
        role  = 'admin';
end $$;
