create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Learner',
  current_hsk_level smallint not null default 1 check (current_hsk_level between 1 and 6),
  membership text not null default 'free' check (membership in ('free', 'vip', 'premium')),
  locale text not null default 'en' check (locale in ('en', 'az', 'zh')),
  created_at timestamptz not null default now()
);

create table if not exists public.practice_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hsk_level smallint not null check (hsk_level between 1 and 6),
  tool text not null,
  score integer not null,
  total integer not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hsk_level smallint not null check (hsk_level between 1 and 6),
  exam_id text not null,
  section_scores jsonb not null default '{}'::jsonb,
  total_score integer not null,
  total_possible integer not null,
  passed boolean not null,
  duration_sec integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.srs_cards (
  user_id uuid not null references public.profiles (id) on delete cascade,
  vocab_id text not null,
  due_at timestamptz not null default now(),
  interval integer not null default 0,
  ease numeric not null default 2.5,
  reps integer not null default 0,
  lapses integer not null default 0,
  primary key (user_id, vocab_id)
);

create table if not exists public.admins (
  email text primary key
);

create table if not exists public.mistake_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  vocab_id text not null,
  skill text not null default 'vocab',
  prompt text not null default '',
  times integer not null default 1,
  last_wrong_at timestamptz not null default now(),
  primary key (user_id, vocab_id, skill)
);

alter table public.profiles enable row level security;
alter table public.practice_results enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.srs_cards enable row level security;
alter table public.admins enable row level security;
alter table public.mistake_items enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create policy "results_select_own" on public.practice_results
  for select to authenticated using (user_id = auth.uid());
create policy "results_insert_own" on public.practice_results
  for insert to authenticated with check (user_id = auth.uid());

create policy "exams_select_own" on public.exam_attempts
  for select to authenticated using (user_id = auth.uid());
create policy "exams_insert_own" on public.exam_attempts
  for insert to authenticated with check (user_id = auth.uid());

create policy "srs_select_own" on public.srs_cards
  for select to authenticated using (user_id = auth.uid());
create policy "srs_insert_own" on public.srs_cards
  for insert to authenticated with check (user_id = auth.uid());
create policy "srs_update_own" on public.srs_cards
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "mistakes_select_own" on public.mistake_items
  for select to authenticated using (user_id = auth.uid());
create policy "mistakes_insert_own" on public.mistake_items
  for insert to authenticated with check (user_id = auth.uid());
create policy "mistakes_update_own" on public.mistake_items
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mistakes_delete_own" on public.mistake_items
  for delete to authenticated using (user_id = auth.uid());

revoke update on table public.profiles from authenticated, anon;
grant update (display_name, current_hsk_level, locale) on table public.profiles to authenticated;

create or replace function public.admin_is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if current_email = '' then
    return false;
  end if;
  if not exists (select 1 from public.admins) then
    insert into public.admins (email) values (current_email)
    on conflict (email) do nothing;
  end if;
  return exists (
    select 1 from public.admins where lower(email) = current_email
  );
end;
$$;

revoke all on function public.admin_is_admin() from public;
grant execute on function public.admin_is_admin() to authenticated;

create or replace function public.admin_set_membership(target_id uuid, new_plan text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_is_admin() then
    raise exception 'Not an admin';
  end if;
  if new_plan not in ('free', 'vip', 'premium') then
    raise exception 'Invalid plan';
  end if;
  update public.profiles
     set membership = new_plan
   where id = target_id;
  if not found then
    raise exception 'User not found';
  end if;
end;
$$;

revoke all on function public.admin_set_membership(uuid, text) from public;
grant execute on function public.admin_set_membership(uuid, text) to authenticated;

create or replace function public.admin_search_users(query text)
returns table(
  id uuid,
  email text,
  display_name text,
  membership text,
  current_hsk_level smallint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.admin_is_admin() then
    raise exception 'Not an admin';
  end if;
  return query
  select p.id,
         u.email::text,
         p.display_name,
         p.membership,
         p.current_hsk_level
  from public.profiles p
  join auth.users u on u.id = p.id
  where coalesce(query, '') = ''
     or u.email ilike '%' || query || '%'
     or p.display_name ilike '%' || query || '%'
  order by u.email
  limit 50;
end;
$$;

revoke all on function public.admin_search_users(text) from public;
grant execute on function public.admin_search_users(text) to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Learner')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
