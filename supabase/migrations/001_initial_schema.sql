-- ============================================================
-- SDA360 - Schema Inicial
-- Multi-tenant com RLS (Row Level Security)
-- ============================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum (
  'master', 'pastor', 'elder', 'ministry_leader',
  'team_member', 'parent', 'member', 'public'
);

create type member_status as enum (
  'baptized', 'awaiting_transfer', 'visitor', 'regular_attendee'
);

create type event_status as enum (
  'draft', 'pending_approval', 'approved', 'published', 'cancelled'
);

create type event_type as enum (
  'worship_service', 'youth_meeting', 'prayer_vigil', 'special',
  'internal', 'community'
);

create type ministry_type as enum (
  'music', 'media', 'sound', 'broadcast', 'reception', 'asa',
  'womens', 'mens', 'youth', 'pathfinders', 'adventurers',
  'secretariat', 'treasury', 'eldership', 'programming', 'custom'
);

create type visitor_status as enum (
  'new', 'in_follow_up', 'integrated', 'inactive'
);

create type permission_action as enum (
  'view', 'create', 'edit', 'delete', 'approve', 'publish'
);

-- ============================================================
-- TABELA: churches (Tenant)
-- ============================================================

create table churches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text not null default '#1d4ed8',
  secondary_color text not null default '#7c3aed',
  domain text unique,
  system_name text not null default 'SDA360',
  address text,
  city text,
  state text,
  country text not null default 'US',
  phone text,
  email text,
  website text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table church_settings (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  timezone text not null default 'America/New_York',
  language text not null default 'pt-BR',
  enable_visitor_form boolean not null default true,
  enable_pathfinders boolean not null default false,
  enable_adventurers boolean not null default false,
  enable_treasury boolean not null default false,
  enable_communication boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(church_id)
);

-- ============================================================
-- TABELA: profiles (Usuários por tenant)
-- ============================================================

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  church_id uuid not null references churches(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  phone text,
  role user_role not null default 'member',
  status text not null default 'pending',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(auth_user_id, church_id)
);

-- ============================================================
-- TABELA: members (Fichas de membros)
-- ============================================================

create table members (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  full_name text not null,
  photo_url text,
  status member_status not null default 'baptized',
  baptism_date date,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  email text,
  responsible_elder_id uuid references profiles(id) on delete set null,
  transfer_history jsonb not null default '[]',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: visitors (CRM Missionário)
-- ============================================================

create table visitors (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  first_visit_date date not null default current_date,
  has_children boolean not null default false,
  prayer_request text,
  interest_bible_study boolean not null default false,
  interest_club boolean not null default false,
  interest_ministry boolean not null default false,
  interest_social_help boolean not null default false,
  assigned_to_id uuid references profiles(id) on delete set null,
  follow_up_notes jsonb not null default '[]',
  status visitor_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: ministries
-- ============================================================

create table ministries (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  name text not null,
  type ministry_type not null default 'custom',
  description text,
  leader_id uuid references profiles(id) on delete set null,
  responsible_elder_id uuid references profiles(id) on delete set null,
  is_active boolean not null default true,
  modules jsonb not null default '{"agenda": true, "scale": false, "documents": false, "reports": false, "notifications": false}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ministry_members (
  id uuid primary key default uuid_generate_v4(),
  ministry_id uuid not null references ministries(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('leader', 'co_leader', 'member')),
  joined_at timestamptz not null default now(),
  unique(ministry_id, profile_id)
);

-- ============================================================
-- TABELA: events (Agenda Central)
-- ============================================================

create table events (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  title text not null,
  description text,
  type event_type not null default 'worship_service',
  status event_status not null default 'draft',
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text,
  is_recurring boolean not null default false,
  recurrence_rule text,
  responsible_ids uuid[] not null default '{}',
  ministry_ids uuid[] not null default '{}',
  checklist jsonb not null default '[]',
  attachments text[] not null default '{}',
  notes text,
  created_by_id uuid not null references profiles(id),
  approved_by_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: service_programs (Programação de Culto)
-- ============================================================

create table service_programs (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  date date not null,
  type event_type not null default 'worship_service',
  title text not null,
  blocks jsonb not null default '[]',
  notes text,
  total_estimated_minutes integer not null default 0,
  total_real_minutes integer,
  created_by_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: scales (Escalas de Ministério)
-- ============================================================

create table scales (
  id uuid primary key default uuid_generate_v4(),
  ministry_id uuid not null references ministries(id) on delete cascade,
  church_id uuid not null references churches(id) on delete cascade,
  date date not null,
  event_id uuid references events(id) on delete set null,
  assignments jsonb not null default '[]',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: commission_minutes (Atas da Comissão)
-- ============================================================

create table commission_minutes (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  date date not null,
  participants uuid[] not null default '{}',
  content text not null,
  tags text[] not null default '{}',
  created_by_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: notifications
-- ============================================================

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'info',
  is_read boolean not null default false,
  link text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABELA: audit_logs
-- ============================================================

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid not null,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

create index idx_profiles_church_id on profiles(church_id);
create index idx_profiles_auth_user_id on profiles(auth_user_id);
create index idx_members_church_id on members(church_id);
create index idx_visitors_church_id on visitors(church_id);
create index idx_ministries_church_id on ministries(church_id);
create index idx_events_church_id on events(church_id);
create index idx_events_start_date on events(start_date);
create index idx_events_status on events(status);
create index idx_notifications_recipient on notifications(recipient_id, is_read);
create index idx_audit_logs_church_id on audit_logs(church_id);

-- ============================================================
-- FUNÇÃO: get_current_church_id()
-- Retorna o church_id do usuário logado via JWT claim
-- ============================================================

create or replace function get_current_church_id()
returns uuid
language sql
stable
as $$
  select church_id from profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

-- ============================================================
-- FUNÇÃO: get_current_user_role()
-- Retorna o role do usuário logado no tenant atual
-- ============================================================

create or replace function get_current_user_role()
returns user_role
language sql
stable
as $$
  select role from profiles
  where auth_user_id = auth.uid()
  and church_id = get_current_church_id()
  limit 1;
$$;

-- ============================================================
-- FUNÇÃO: updated_at trigger
-- ============================================================

create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplicar trigger de updated_at em todas as tabelas
create trigger trg_churches_updated_at before update on churches for each row execute function handle_updated_at();
create trigger trg_church_settings_updated_at before update on church_settings for each row execute function handle_updated_at();
create trigger trg_profiles_updated_at before update on profiles for each row execute function handle_updated_at();
create trigger trg_members_updated_at before update on members for each row execute function handle_updated_at();
create trigger trg_visitors_updated_at before update on visitors for each row execute function handle_updated_at();
create trigger trg_ministries_updated_at before update on ministries for each row execute function handle_updated_at();
create trigger trg_events_updated_at before update on events for each row execute function handle_updated_at();
create trigger trg_service_programs_updated_at before update on service_programs for each row execute function handle_updated_at();
create trigger trg_scales_updated_at before update on scales for each row execute function handle_updated_at();
create trigger trg_commission_minutes_updated_at before update on commission_minutes for each row execute function handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
alter table churches enable row level security;
alter table church_settings enable row level security;
alter table profiles enable row level security;
alter table members enable row level security;
alter table visitors enable row level security;
alter table ministries enable row level security;
alter table ministry_members enable row level security;
alter table events enable row level security;
alter table service_programs enable row level security;
alter table scales enable row level security;
alter table commission_minutes enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- ============================================================
-- POLÍTICAS RLS: churches
-- ============================================================

create policy "Usuário vê apenas sua igreja"
  on churches for select
  using (id = get_current_church_id());

create policy "Apenas master pode criar igrejas"
  on churches for insert
  with check (false); -- gerenciado via service_role

-- ============================================================
-- POLÍTICAS RLS: profiles
-- ============================================================

create policy "Perfil próprio sempre visível"
  on profiles for select
  using (auth_user_id = auth.uid() or church_id = get_current_church_id());

create policy "Usuário atualiza próprio perfil"
  on profiles for update
  using (auth_user_id = auth.uid());

create policy "Inserção via signup"
  on profiles for insert
  with check (auth_user_id = auth.uid());

-- ============================================================
-- POLÍTICAS RLS: members
-- ============================================================

create policy "Membros visíveis dentro da igreja"
  on members for select
  using (church_id = get_current_church_id());

create policy "Apenas pastor/elder/secretaria podem inserir membros"
  on members for insert
  with check (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader')
  );

create policy "Apenas pastor/elder/secretaria podem editar membros"
  on members for update
  using (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader')
  );

-- ============================================================
-- POLÍTICAS RLS: visitors
-- ============================================================

create policy "Visitantes visíveis dentro da igreja"
  on visitors for select
  using (church_id = get_current_church_id());

create policy "Qualquer membro pode inserir visitante"
  on visitors for insert
  with check (church_id = get_current_church_id());

create policy "Responsável e líderes podem atualizar visitante"
  on visitors for update
  using (
    church_id = get_current_church_id() and (
      assigned_to_id = (select id from profiles where auth_user_id = auth.uid() limit 1) or
      get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader')
    )
  );

-- ============================================================
-- POLÍTICAS RLS: ministries
-- ============================================================

create policy "Ministérios visíveis dentro da igreja"
  on ministries for select
  using (church_id = get_current_church_id());

create policy "Apenas master/pastor/elder podem criar ministérios"
  on ministries for insert
  with check (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder')
  );

create policy "Líder/elder/pastor podem atualizar ministério"
  on ministries for update
  using (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader')
  );

-- ============================================================
-- POLÍTICAS RLS: events
-- ============================================================

create policy "Eventos públicos/aprovados são visíveis por todos da igreja"
  on events for select
  using (
    church_id = get_current_church_id() and (
      status in ('approved', 'published') or
      created_by_id = (select id from profiles where auth_user_id = auth.uid() limit 1) or
      get_current_user_role() in ('master', 'pastor', 'elder')
    )
  );

create policy "Membros ativos podem criar eventos"
  on events for insert
  with check (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader', 'team_member')
  );

create policy "Criador e aprovadores podem atualizar eventos"
  on events for update
  using (
    church_id = get_current_church_id() and (
      created_by_id = (select id from profiles where auth_user_id = auth.uid() limit 1) or
      get_current_user_role() in ('master', 'pastor', 'elder')
    )
  );

-- ============================================================
-- POLÍTICAS RLS: service_programs
-- ============================================================

create policy "Programações visíveis dentro da igreja"
  on service_programs for select
  using (church_id = get_current_church_id());

create policy "Apenas responsáveis pela programação podem inserir"
  on service_programs for insert
  with check (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder', 'ministry_leader')
  );

-- ============================================================
-- POLÍTICAS RLS: notifications
-- ============================================================

create policy "Usuário vê apenas suas notificações"
  on notifications for select
  using (
    recipient_id = (select id from profiles where auth_user_id = auth.uid() limit 1)
  );

create policy "Usuário atualiza apenas suas notificações"
  on notifications for update
  using (
    recipient_id = (select id from profiles where auth_user_id = auth.uid() limit 1)
  );

-- ============================================================
-- POLÍTICAS RLS: audit_logs
-- ============================================================

create policy "Apenas master/pastor/elder podem ver logs"
  on audit_logs for select
  using (
    church_id = get_current_church_id() and
    get_current_user_role() in ('master', 'pastor', 'elder')
  );

-- ============================================================
-- FUNÇÃO: handle_new_user (trigger no signup do Supabase Auth)
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Perfil será criado via onboarding, não automaticamente
  -- Isso permite selecionar a igreja no fluxo de cadastro
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
