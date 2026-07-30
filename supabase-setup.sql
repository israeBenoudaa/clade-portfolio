-- ══════════════════════════════════════════════════════════════════
-- CLADE — Table portfolio_projects
-- Copiez ce SQL dans l'éditeur Supabase : Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- 1. Création de la table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id             SERIAL PRIMARY KEY,
  title          text        NOT NULL,
  location       text,
  year           text,
  description    text,
  axis           text        NOT NULL CHECK (axis IN ('C','L','A','D','E')),
  programme      text,
  surface        text,
  statut         text        DEFAULT 'En cours',
  maitre_ouvrage text,
  story          text,
  image_url      text,
  gallery        text[]      DEFAULT '{}',
  tags           text[]      DEFAULT '{}',
  span           text        DEFAULT 'normal' CHECK (span IN ('wide','tall','normal')),
  display_order  int         DEFAULT 0,
  visible        boolean     DEFAULT true,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- 2. RLS : lecture publique des projets visibles, écriture pour les authentifiés
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read visible projects"         ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated full access"            ON portfolio_projects;

CREATE POLICY "Public read visible projects"
  ON portfolio_projects FOR SELECT
  USING (visible = true);

CREATE POLICY "Authenticated full access"
  ON portfolio_projects FOR ALL
  USING (auth.role() = 'authenticated');

-- 3. Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_portfolio_updated_at ON portfolio_projects;
CREATE TRIGGER trg_portfolio_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Données initiales — 18 projets réels
INSERT INTO portfolio_projects
  (title, location, year, description, axis, programme, surface, statut, maitre_ouvrage, story, image_url, tags, span, display_order)
VALUES
(
  'Maison d''hôtes — Riad restauré',
  'Fès', '2024',
  'Réhabilitation complète d''un riad du XIXe siècle en maison d''hôtes de charme de 8 chambres.',
  'C', 'Réhabilitation patrimoniale, hébergement', '250 m²', 'Livré',
  'Client privé étranger',
  '',
  'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Conservation','Patrimoine','Riad'],
  'wide', 1
),
(
  'Jardin de villa de luxe',
  'Marrakech', '2024',
  'Aménagement paysager d''une villa privée : terrasses végétalisées, bassin, jardins à la française revisités.',
  'L', 'Aménagement paysager résidentiel', '1 200 m²', 'Livré',
  'Privé',
  '',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Landscape','Jardin','Résidentiel'],
  'tall', 2
),
(
  'Restaurant — Patio & Intérieur',
  'Marrakech', '2023',
  'Conception intérieure et paysagère d''un restaurant gastronomique autour d''un patio central planté.',
  'L', 'Restauration, F&B', '320 m²', 'Livré',
  'Restaurateur privé',
  '',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Landscape','Restauration','Patio'],
  'normal', 3
),
(
  'Hôtel de luxe',
  'Tanger', '2025',
  'Conception architecturale d''un hôtel boutique de 45 chambres en surplomb de la méditerranée.',
  'A', 'Hôtellerie boutique', '3 500 m²', 'En cours',
  'Groupe hôtelier',
  '',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Hôtellerie','Luxe'],
  'wide', 4
),
(
  'Pop-Shop & Identité de marque',
  'Casablanca', '2024',
  'Conception d''une chaîne de boutiques modulables et de l''identité visuelle associée.',
  'A', 'Retail duplicable + branding', '90 m² / boutique', 'Livré',
  'Groupe commercial',
  '',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Retail','Design'],
  'normal', 5
),
(
  'Villa contemporaine',
  'Tanger', '2023',
  'Résidence de luxe en R+2, volumes épurés et ouvertures panoramiques sur l''atlantique.',
  'A', 'Résidentiel de luxe', '450 m²', 'Livré',
  'Privé',
  '',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Résidentiel','Luxe'],
  'normal', 6
),
(
  'Cabinet médical premium',
  'Rabat', '2024',
  'Aménagement d''un cabinet médical pluridisciplinaire avec salle d''attente lounge et espaces modulables.',
  'A', 'Santé, cabinet premium', '180 m²', 'Livré',
  'Cabinet SISA',
  '',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Santé','Premium'],
  'normal', 7
),
(
  'Plateau de bureaux',
  'Casablanca', '2024',
  'Requalification d''un plateau tertiaire brut en espace de travail hybride et collaboratif.',
  'A', 'Tertiaire, aménagement', '600 m²', 'Livré',
  'Groupe immobilier',
  '',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Tertiaire','Bureaux'],
  'tall', 8
),
(
  'Salle de sport & Wellness',
  'Casablanca', '2024',
  'Conception d''une salle de sport premium avec espace wellness, hammam et zone nutrition.',
  'A', 'Sport / wellness premium', '800 m²', 'Livré',
  'Promoteur privé',
  '',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Sport','Wellness'],
  'wide', 9
),
(
  'Atelier de production propre',
  'Kénitra', '2025',
  'Bâtiment industriel basse consommation : flux optimisés, lumière naturelle, matériaux locaux.',
  'A', 'Atelier de production propre', '2 500 m²', 'En cours',
  'Industriel local',
  '',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Industrie','Écologie'],
  'normal', 10
),
(
  'Éco-resort & Piscine',
  'Dakhla', '2025',
  'Complexe éco-touristique de 32 lodges en harmonie avec le désert côtier atlantique.',
  'A', 'Complexe touristique', '5 000 m²', 'En conception',
  'Investisseur international',
  '',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Resort','Tourisme'],
  'tall', 11
),
(
  'Station-service',
  'Agadir', '2023',
  'Requalification architecturale d''une station-service en objet urbain identitaire.',
  'A', 'Infrastructure routière', '400 m²', 'Livré',
  'Opérateur pétrolier',
  '',
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Infrastructure','Identité'],
  'normal', 12
),
(
  'Groupement de villas',
  'Bouznika', '2024',
  'Plan-masse et conception architecturale d''un lotissement de 18 villas en bord de mer.',
  'A', 'Résidentiel, plan-masse', '8 000 m²', 'En cours',
  'Promoteur immobilier',
  '',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Architecture','Résidentiel','Plan-masse'],
  'wide', 13
),
(
  'Meuble pour villa',
  'Tanger', '2024',
  'Conception d''une pièce de mobilier sur-mesure en noyer et métal laqué pour salon principal.',
  'D', 'Mobilier sur-mesure', '— (objet)', 'Livré',
  'Client privé',
  '',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Design','Mobilier','Sur-mesure'],
  'normal', 14
),
(
  'Luminaire de collection',
  'Casablanca', '2024',
  'Design d''une gamme de luminaires pour une marque marocaine d''édition d''objets.',
  'D', 'Design produit pour marque', '— (objet)', 'Livré',
  'Marque locale',
  '',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Design','Luminaire','Produit'],
  'normal', 15
),
(
  'Stand salon professionnel',
  'Casablanca', '2024',
  'Scénographie et fabrication d''un stand de 60 m² pour salon professionnel du bâtiment.',
  'E', 'Scénographie salon', '60 m²', 'Démonté',
  'Salon professionnel',
  '',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Éphémère','Stand','Événementiel'],
  'tall', 16
),
(
  'Salle de fête extérieure',
  'Marrakech', '2024',
  'Architecture événementielle pour une salle de fête outdoor de 800 m², démontable en 48h.',
  'E', 'Événementiel outdoor', '800 m²', 'Démonté',
  'Famille privée',
  '',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Éphémère','Événementiel','Outdoor'],
  'wide', 17
),
(
  'Foodtruck nomade',
  'Tanger', '2023',
  'Conception d''un foodtruck — architecture nomade, branding et aménagement intérieur.',
  'E', 'Architecture nomade + branding', '12 m²', 'Livré',
  'Entrepreneur individuel',
  '',
  'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=1800&q=80&auto=format&fit=crop',
  ARRAY['Éphémère','Foodtruck','Nomade'],
  'normal', 18
);
