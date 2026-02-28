-- ============================================================
-- SDA360 - Dados Iniciais de Demonstração
-- ============================================================

-- Igreja exemplo
insert into churches (id, name, slug, system_name, primary_color, secondary_color, city, state, country, email)
values (
  '00000000-0000-0000-0000-000000000001',
  'Igreja Adventista do Sétimo Dia - Orlando Central',
  'iasd-orlando-central',
  'SDA360',
  '#1d4ed8',
  '#7c3aed',
  'Orlando',
  'FL',
  'US',
  'admin@iadsorlando.org'
);

-- Configurações da igreja
insert into church_settings (church_id, timezone, language, enable_visitor_form, enable_pathfinders, enable_adventurers, enable_communication)
values (
  '00000000-0000-0000-0000-000000000001',
  'America/New_York',
  'pt-BR',
  true,
  true,
  true,
  true
);

-- Ministérios iniciais
insert into ministries (church_id, name, type, is_active, modules) values
('00000000-0000-0000-0000-000000000001', 'Música', 'music', true, '{"agenda": true, "scale": true, "documents": false, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Mídia', 'media', true, '{"agenda": true, "scale": true, "documents": false, "reports": false, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Som', 'sound', true, '{"agenda": true, "scale": true, "documents": false, "reports": false, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Transmissão', 'broadcast', true, '{"agenda": true, "scale": true, "documents": false, "reports": false, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Recepção', 'reception', true, '{"agenda": true, "scale": true, "documents": false, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'ASA', 'asa', true, '{"agenda": true, "scale": false, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Ministério da Mulher', 'womens', true, '{"agenda": true, "scale": false, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Ministério dos Homens', 'mens', true, '{"agenda": true, "scale": false, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Jovens (JA)', 'youth', true, '{"agenda": true, "scale": true, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Desbravadores', 'pathfinders', true, '{"agenda": true, "scale": true, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Aventureiros', 'adventurers', true, '{"agenda": true, "scale": false, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Secretaria', 'secretariat', true, '{"agenda": false, "scale": false, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Tesouraria', 'treasury', false, '{"agenda": false, "scale": false, "documents": true, "reports": true, "notifications": false}'),
('00000000-0000-0000-0000-000000000001', 'Ancionato', 'eldership', true, '{"agenda": true, "scale": true, "documents": true, "reports": true, "notifications": true}'),
('00000000-0000-0000-0000-000000000001', 'Programação', 'programming', true, '{"agenda": true, "scale": false, "documents": false, "reports": true, "notifications": true}');
