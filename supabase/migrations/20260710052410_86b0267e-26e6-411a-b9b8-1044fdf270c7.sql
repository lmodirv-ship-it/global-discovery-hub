
-- Roles enum
create type public.app_role as enum ('owner', 'supervisor', 'customer', 'visitor');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  is_protected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- has_role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Protected owner emails
create or replace function public.is_protected_owner_email(_email text)
returns boolean language sql immutable as $$
  select lower(_email) in ('lmodirv@gmail.com', 'info@hnchat.net')
$$;

-- Profiles policies
create policy "profiles: self read" on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "profiles: owner read all" on public.profiles for select to authenticated
  using (public.has_role(auth.uid(), 'owner'));
create policy "profiles: self update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: owner update all" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(), 'owner')) with check (public.has_role(auth.uid(), 'owner'));

-- User roles policies
create policy "roles: self read" on public.user_roles for select to authenticated
  using (user_id = auth.uid());
create policy "roles: owner read all" on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'owner'));
create policy "roles: owner insert" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'owner'));
create policy "roles: owner delete" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'owner'));

-- Prevent removing owner role from protected accounts
create or replace function public.protect_owner_role()
returns trigger language plpgsql security definer set search_path = public as $$
declare _email text;
begin
  if tg_op = 'DELETE' and old.role = 'owner' then
    select email into _email from auth.users where id = old.user_id;
    if public.is_protected_owner_email(_email) then
      raise exception 'Cannot remove owner role from protected account';
    end if;
  end if;
  return old;
end $$;
create trigger protect_owner_role_trg before delete on public.user_roles
  for each row execute function public.protect_owner_role();

-- Prevent deleting protected profiles
create or replace function public.protect_owner_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.is_protected then
    raise exception 'Cannot delete protected owner profile';
  end if;
  return old;
end $$;
create trigger protect_owner_profile_trg before delete on public.profiles
  for each row execute function public.protect_owner_profile();

-- On new auth user: create profile + assign role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare _protected boolean;
begin
  _protected := public.is_protected_owner_email(new.email);
  insert into public.profiles (id, email, full_name, is_protected)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), _protected)
  on conflict (id) do update set email = excluded.email, is_protected = excluded.is_protected;

  if _protected then
    insert into public.user_roles (user_id, role) values (new.id, 'owner')
    on conflict (user_id, role) do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'visitor')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
