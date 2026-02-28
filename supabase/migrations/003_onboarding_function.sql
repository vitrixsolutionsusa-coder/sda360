-- ============================================================
-- SDA360 - Função de Onboarding com SECURITY DEFINER
-- Permite criar igreja + perfil master bypassando RLS
-- ============================================================

create or replace function complete_church_onboarding(
  p_church_name       text,
  p_church_slug       text,
  p_church_city       text,
  p_church_state      text,
  p_church_country    text,
  p_church_phone      text,
  p_church_email      text,
  p_church_address    text,
  p_system_name       text,
  p_primary_color     text,
  p_secondary_color   text,
  p_admin_full_name   text,
  p_admin_phone       text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_church_id   uuid;
  v_profile_id  uuid;
  v_user_id     uuid;
  v_slug        text;
begin
  -- Pega o usuário autenticado
  v_user_id := auth.uid();

  if v_user_id is null then
    return json_build_object('success', false, 'error', 'Usuário não autenticado.');
  end if;

  -- Verifica se já tem perfil
  if exists (select 1 from profiles where auth_user_id = v_user_id) then
    return json_build_object('success', false, 'error', 'Você já possui uma igreja cadastrada.');
  end if;

  -- Normaliza slug
  v_slug := lower(p_church_slug);

  -- Verifica slug único
  if exists (select 1 from churches where slug = v_slug) then
    return json_build_object('success', false, 'error', 'Já existe uma igreja com esse identificador. Tente outro nome.');
  end if;

  -- Cria a igreja
  insert into churches (
    name, slug, city, state, country, phone, email, address,
    system_name, primary_color, secondary_color, is_active
  ) values (
    p_church_name, v_slug, p_church_city, p_church_state, p_church_country,
    nullif(p_church_phone, ''), p_church_email, nullif(p_church_address, ''),
    p_system_name, p_primary_color, p_secondary_color, true
  )
  returning id into v_church_id;

  -- Cria configurações da igreja
  insert into church_settings (
    church_id, timezone, language, enable_visitor_form,
    enable_pathfinders, enable_adventurers, enable_treasury, enable_communication
  ) values (
    v_church_id,
    case when p_church_country = 'US' then 'America/New_York' else 'America/Sao_Paulo' end,
    'pt-BR', true, false, false, false, true
  );

  -- Cria ministérios padrão
  insert into ministries (church_id, name, type, is_active, modules) values
    (v_church_id, 'Música',       'music',       true, '{"agenda":true,"scale":true,"documents":false,"reports":true,"notifications":true}'),
    (v_church_id, 'Mídia',        'media',       true, '{"agenda":true,"scale":true,"documents":false,"reports":false,"notifications":true}'),
    (v_church_id, 'Som',          'sound',       true, '{"agenda":true,"scale":true,"documents":false,"reports":false,"notifications":true}'),
    (v_church_id, 'Transmissão',  'broadcast',   true, '{"agenda":true,"scale":true,"documents":false,"reports":false,"notifications":true}'),
    (v_church_id, 'Recepção',     'reception',   true, '{"agenda":true,"scale":true,"documents":false,"reports":true,"notifications":true}'),
    (v_church_id, 'Jovens (JA)',  'youth',       true, '{"agenda":true,"scale":true,"documents":true,"reports":true,"notifications":true}'),
    (v_church_id, 'Secretaria',   'secretariat', true, '{"agenda":false,"scale":false,"documents":true,"reports":true,"notifications":true}'),
    (v_church_id, 'Ancionato',    'eldership',   true, '{"agenda":true,"scale":true,"documents":true,"reports":true,"notifications":true}'),
    (v_church_id, 'Programação',  'programming', true, '{"agenda":true,"scale":false,"documents":false,"reports":true,"notifications":true}');

  -- Cria o perfil master
  insert into profiles (
    auth_user_id, church_id, full_name, phone, role, status, is_verified
  ) values (
    v_user_id, v_church_id, p_admin_full_name,
    nullif(p_admin_phone, ''), 'master', 'active', true
  )
  returning id into v_profile_id;

  return json_build_object(
    'success', true,
    'church_id', v_church_id,
    'profile_id', v_profile_id
  );

exception
  when others then
    return json_build_object('success', false, 'error', 'Erro interno: ' || sqlerrm);
end;
$$;

-- Garante que apenas usuários autenticados podem chamar
revoke execute on function complete_church_onboarding from anon;
grant execute on function complete_church_onboarding to authenticated;
