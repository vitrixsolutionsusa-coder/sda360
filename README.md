# SDA360

> Sistema Operacional Ministerial para igrejas adventistas locais brasileiras nos EUA.

Plataforma SaaS White-Label multi-tenant para gestão operacional de igrejas adventistas locais.

---

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| **Next.js 15** (App Router) | Framework principal |
| **TypeScript** | Tipagem estática |
| **Supabase** | Auth + PostgreSQL + RLS |
| **Tailwind CSS v4** | Estilização |
| **shadcn/ui** + Radix UI | Componentes |
| **React Query** | State management |
| **React Hook Form** + Zod | Formulários e validação |
| **Turborepo** | Monorepo |
| **pnpm** | Gerenciador de pacotes |

---

## Estrutura do Monorepo

```
sda360/
├── apps/
│   ├── web/          # Next.js 15 - App principal
│   └── mobile/       # PWA Mobile (em breve)
├── packages/
│   ├── ui/           # Componentes compartilhados
│   ├── database/     # Tipos do Supabase
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── eslint-config/
│   └── typescript-config/
├── supabase/
│   ├── migrations/   # Migrations SQL
│   └── config.toml
└── turbo.json
```

---

## Módulos do Sistema

| Módulo | Fase | Status |
|---|---|---|
| Core + Auth + RBAC | Fase 1 | ✅ Base |
| Pessoas (Membros + Visitantes) | Fase 1 | ✅ Schema |
| Ministérios | Fase 1 | ✅ Schema |
| Agenda Central | Fase 1 | ✅ Schema |
| Programação de Culto | Fase 2 | 🔜 |
| Recepção (CRM) | Fase 2 | 🔜 |
| Desbravadores / Aventureiros | Fase 3 | 🔜 |
| Relatórios + White-Label | Fase 4 | 🔜 |

---

## Como Rodar

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9
- Supabase CLI (para desenvolvimento local)

### Setup

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp apps/web/.env.local.example apps/web/.env.local
# Edite com suas credenciais Supabase

# 3. Rodar o projeto
pnpm dev
```

### Supabase Local

```bash
# Instalar Supabase CLI
brew install supabase/tap/supabase

# Iniciar Supabase local
supabase start

# Aplicar migrations
supabase db reset
```

---

## Arquitetura Multi-Tenant

Cada igreja é um **tenant isolado** identificado por `church_id`. O isolamento é garantido via:

- **Row Level Security (RLS)** no PostgreSQL
- Função `get_current_church_id()` derivada do JWT do usuário logado
- Todas as queries filtram automaticamente pelo tenant do usuário

---

## Roles (RBAC)

| Role | Nível | Acesso |
|---|---|---|
| `master` | Super Admin | Acesso total ao sistema |
| `pastor` | Admin Igreja | Gestão completa |
| `elder` | Ancião | Aprovações + membros + agenda |
| `ministry_leader` | Líder | Seu ministério + escalas |
| `team_member` | Equipe | Tarefas do seu ministério |
| `parent` | Pai/Responsável | Área dos filhos |
| `member` | Membro | Agenda pública + perfil |
| `public` | Visitante | Formulário de visita |

---

## White-Label

Cada igreja pode configurar:
- Nome do sistema
- Logo
- Cores (primária e secundária)
- Domínio personalizado

As cores são aplicadas via CSS custom properties (`--church-primary`, `--church-secondary`).

---

*Don't forget to commit*

Sugestão de commit:
```
Feat(sda360): initial monorepo setup with Next.js 15, Supabase, multi-tenant RLS schema and base layout
```
