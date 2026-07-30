-- ══════════════════════════════════════════════════════════════════
-- CLADE PORTFOLIO ↔ APP — Script Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Peut être ré-exécuté sans risque (DROP IF EXISTS sur toutes les policies)
-- ══════════════════════════════════════════════════════════════════

-- 1. Colonnes manquantes sur la table prospects
alter table prospects
  add column if not exists source       text,
  add column if not exists notes        text,
  add column if not exists localisation text,
  add column if not exists surface      numeric,
  add column if not exists portal_blocked boolean default false;

-- 2. RLS prospects — INSERT public (formulaire portfolio)
alter table prospects enable row level security;

drop policy if exists "portfolio_insert_prospects" on prospects;
create policy "portfolio_insert_prospects"
  on prospects for insert
  with check (true);

-- 3. Table candidatures_spont (création + colonnes manquantes si table déjà existante)
create table if not exists candidatures_spont (
  id             text primary key,
  prenom         text,
  nom            text,
  email          text,
  telephone      text,
  poste_vise     text,
  message        text,
  cv_url         text,
  statut         text default 'nouveau',
  date_reception text,
  notes          text,
  offre_id       text,
  created_at     timestamptz default now()
);

-- Ajoute les colonnes manquantes si la table existait déjà sans elles
alter table candidatures_spont add column if not exists offre_id text;
alter table candidatures_spont add column if not exists cv_url text;
alter table candidatures_spont add column if not exists notes text;
alter table candidatures_spont add column if not exists departement text;
alter table candidatures_spont add column if not exists portfolio_url text;

-- 4. RLS candidatures_spont
alter table candidatures_spont enable row level security;

drop policy if exists "portfolio_insert_candidatures" on candidatures_spont;
create policy "portfolio_insert_candidatures"
  on candidatures_spont for insert
  with check (true);

drop policy if exists "app_select_candidatures" on candidatures_spont;
create policy "app_select_candidatures"
  on candidatures_spont for select
  using (true);

drop policy if exists "app_update_candidatures" on candidatures_spont;
create policy "app_update_candidatures"
  on candidatures_spont for update
  using (true);

-- 5. Table recrutements — colonnes manquantes + RLS
alter table recrutements add column if not exists missions    text;
alter table recrutements add column if not exists salaire_min numeric;
alter table recrutements add column if not exists salaire_max numeric;

alter table recrutements enable row level security;

-- Anonymes : seulement les postes ouverts
drop policy if exists "portfolio_read_offres_ouvertes" on recrutements;
create policy "portfolio_read_offres_ouvertes"
  on recrutements for select to anon
  using (statut = 'ouvert');

-- Utilisateurs authentifiés (app) : accès complet
drop policy if exists "auth_all_recrutements" on recrutements;
create policy "auth_all_recrutements"
  on recrutements for all to authenticated
  using (true) with check (true);

-- 6. Table departements — lecture publique, écriture par utilisateurs authentifiés
create table if not exists departements (
  id  serial primary key,
  nom text unique not null
);

alter table departements enable row level security;

drop policy if exists "public_read_departements" on departements;
create policy "public_read_departements"
  on departements for select
  using (true);

drop policy if exists "auth_write_departements" on departements;
create policy "auth_write_departements"
  on departements for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "auth_update_departements" on departements;
create policy "auth_update_departements"
  on departements for update
  using (auth.role() = 'authenticated');

-- ══════════════════════════════════════════════════════════════════
-- Résultat attendu après exécution :
-- ✅ Formulaire contact portfolio → table prospects
-- ✅ Candidatures spontanées + postes → table candidatures_spont
-- ✅ Offres de recrutement (statut='ouvert') visibles sur le portfolio
-- ✅ Blocage portail client (portal_blocked) persisté en base
-- ══════════════════════════════════════════════════════════════════
