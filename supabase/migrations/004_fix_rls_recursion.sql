-- ============================================================
-- SDA360 - Fix RLS recursion on profiles table
-- get_current_church_id() queried profiles which triggered
-- the profiles RLS policy again, returning NULL and blocking
-- all profile reads from server-side contexts
-- ============================================================

-- 1. Make helper functions SECURITY DEFINER so they bypass
--    RLS when querying profiles internally
create or replace function get_current_church_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select church_id from profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function get_current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles
  where auth_user_id = auth.uid()
  and church_id = get_current_church_id()
  limit 1;
$$;

-- 2. Simplify profiles SELECT policy — remove the recursive
--    church_id check, use only auth_user_id
drop policy if exists "Perfil próprio sempre visível" on profiles;

create policy "Perfil próprio sempre visível"
  on profiles for select
  using (auth_user_id = auth.uid());

-- 3. Allow members of the same church to see each other
--    (needed for scales, ministries, etc.)
create policy "Perfis da mesma igreja são visíveis"
  on profiles for select
  using (church_id = get_current_church_id());
