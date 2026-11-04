import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AXES } from '../data/projects'
import { useProjects } from '../hooks/useProjects'
import { useSiteContent, useSiteContentJson } from '../context/SiteContentContext'
import { useLanguage } from '../context/LanguageContext'
import AnimatedLogo from '../components/ui/AnimatedLogo'
import PageTransition from '../components/ui/PageTransition'
import QuickContact from '../components/ui/QuickContact'
import LazyBg from '../components/ui/LazyBg'

// Phrases par discipline (même format que Hero)
const PHRASES = {
  C: [
    { line1: 'Préserver', line2: "ce qui porte la mémoire des lieux" },
    { line1: 'Restaurer', line2: "sans effacer les traces du temps" },
    { line1: 'Transmettre', line2: "l'héritage bâti aux générations futures" },
  ],
  L: [
    { line1: 'Composer', line2: "avec la nature, pas contre elle" },
    { line1: 'Lire', line2: "le territoire avant de le toucher" },
    { line1: 'Relier', line2: "le vivant et le construit" },
  ],
  A: [
    { line1: 'Concevoir', line2: "des espaces qui habitent le territoire" },
    { line1: 'Construire', line2: "avec la lumière et la matière" },
    { line1: 'Habiter', line2: "le geste juste, toujours" },
  ],
  D: [
    { line1: 'Donner forme', line2: "aux identités singulières" },
    { line1: 'Créer', line2: "des objets qui durent" },
    { line1: 'Révéler', line2: "la beauté de l'utile" },
  ],
  E: [
    { line1: 'Installer', line2: "le temps d'un instant" },
    { line1: 'Marquer', line2: "sans laisser de trace durable" },
    { line1: 'Célébrer', line2: "l'architecture du moment présent" },
  ],
}

const PHRASES_EN = {
  C: [
    { line1: 'Preserve', line2: "what carries the memory of places" },
    { line1: 'Restore', line2: "without erasing the traces of time" },
    { line1: 'Hand down', line2: "the built heritage to future generations" },
  ],
  L: [
    { line1: 'Compose', line2: "with nature, not against it" },
    { line1: 'Read', line2: "the territory before touching it" },
    { line1: 'Connect', line2: "the living and the built" },
  ],
  A: [
    { line1: 'Design', line2: "spaces that inhabit the territory" },
    { line1: 'Build', line2: "with light and material" },
    { line1: 'Inhabit', line2: "the right gesture, always" },
  ],
  D: [
    { line1: 'Give form', line2: "to singular identities" },
    { line1: 'Create', line2: "objects that last" },
    { line1: 'Reveal', line2: "the beauty of the useful" },
  ],
  E: [
    { line1: 'Install', line2: "for a fleeting moment" },
    { line1: 'Mark', line2: "without leaving a lasting trace" },
    { line1: 'Celebrate', line2: "the architecture of the present" },
  ],
}

const PHRASES_ES = {
  C: [
    { line1: 'Preservar', line2: "lo que lleva la memoria de los lugares" },
    { line1: 'Restaurar', line2: "sin borrar las huellas del tiempo" },
    { line1: 'Transmitir', line2: "el patrimonio construido a las generaciones futuras" },
  ],
  L: [
    { line1: 'Componer', line2: "con la naturaleza, no contra ella" },
    { line1: 'Leer', line2: "el territorio antes de tocarlo" },
    { line1: 'Conectar', line2: "lo vivo y lo construido" },
  ],
  A: [
    { line1: 'Concebir', line2: "espacios que habiten el territorio" },
    { line1: 'Construir', line2: "con la luz y la materia" },
    { line1: 'Habitar', line2: "el gesto justo, siempre" },
  ],
  D: [
    { line1: 'Dar forma', line2: "a las identidades singulares" },
    { line1: 'Crear', line2: "objetos que perduran" },
    { line1: 'Revelar', line2: "la belleza de lo útil" },
  ],
  E: [
    { line1: 'Instalar', line2: "el tiempo de un instante" },
    { line1: 'Marcar', line2: "sin dejar huella duradera" },
    { line1: 'Celebrar', line2: "la arquitectura del momento presente" },
  ],
}

const HERO_IMAGES = {
  C: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1200&q=80&fm=jpg&fl=progressive&fit=crop',
  L: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&q=80&fm=jpg&fl=progressive&fit=crop',
  A: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80&fm=jpg&fl=progressive&fit=crop',
  D: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=1200&q=80&fm=jpg&fl=progressive&fit=crop',
  E: 'https://images.unsplash.com/photo-1519619091416-f5d55b8d0e39?w=1200&q=80&fm=jpg&fl=progressive&fit=crop',
}

const SERVICES = {
  A: [
    { title: "Esquisse & faisabilité",            desc: "Lecture du site, parti pris architectural, étude de volumétrie" },
    { title: "Avant-projet",                       desc: "Plans, coupes, façades, notice descriptive, estimation sommaire" },
    { title: "Dépôt de permis de construire",      desc: "Constitution et dépôt du dossier réglementaire complet" },
    { title: "Plans d'exécution",                  desc: "Plans techniques détaillés transmis aux entreprises" },
    { title: "Consultation des entreprises",       desc: "Appel d'offres, analyse des devis, sélection des intervenants" },
    { title: "Direction et suivi de chantier",     desc: "Réunions de chantier, levée des réserves, réception des travaux" },
  ],
  C: [
    { title: "Diagnostic & relevé de l'existant", desc: "État sanitaire, relevé géométrique, analyse historique du bâti" },
    { title: "Étude patrimoniale",                 desc: "Identification des éléments à conserver, documentation de référence" },
    { title: "Projet de restauration",             desc: "Parti pris, techniques compatibles, matériaux d'origine" },
    { title: "Coordination des corps spécialisés", desc: "Artisans, restaurateurs, laboratoires d'analyse" },
    { title: "Suivi de chantier patrimonial",      desc: "Contrôle de conformité avec les exigences de préservation" },
    { title: "Reconversion adaptative",            desc: "Programme contemporain intégré dans une enveloppe ancienne" },
  ],
  L: [
    { title: "Analyse du site & étude paysagère",  desc: "Lecture du terrain, ensoleillement, végétation existante" },
    { title: "Conception des espaces extérieurs",  desc: "Plans de masse, traitement des sols, mobilier extérieur" },
    { title: "Intégration de l'eau",               desc: "Piscine, bassin, canal, patio humide — l'eau comme fil directeur" },
    { title: "Plans de plantation",                desc: "Choix des espèces, rythmes, palette végétale cohérente avec le site" },
    { title: "Suivi de mise en œuvre",             desc: "Coordination avec l'entrepreneur paysagiste, contrôle qualité" },
    { title: "Entretien & maintenance",            desc: "Recommandations saisonnières, protocole de gestion à long terme" },
  ],
  D: [
    { title: "Brief & recherche",                  desc: "Exploration formelle, références, moodboard, cadrage du projet" },
    { title: "Conception & modélisation",          desc: "Dessin technique, rendu 3D, prototype, plans de fabrication" },
    { title: "Suivi de fabrication",               desc: "Coordination avec les artisans et ateliers, validation des étapes" },
    { title: "Direction artistique",               desc: "Cohérence visuelle sur l'ensemble du projet, arbitrage des choix" },
    { title: "Identité visuelle",                  desc: "Logo, charte graphique, typographie, palette — de la marque à l'espace" },
    { title: "Livraison & installation",           desc: "Mise en place sur site, ajustements finaux, documentation" },
  ],
  E: [
    { title: "Scénographie & concept",             desc: "Narration spatiale, ambiance, parcours du visiteur ou convive" },
    { title: "Plans d'implantation",               desc: "Organisation du site, flux de circulation, zones fonctionnelles" },
    { title: "Structures temporaires",             desc: "Tentes, pavillons, estrades, canopées — durée d'un événement" },
    { title: "Direction artistique",               desc: "Cohérence visuelle, signalétique, éclairage, habillage scénique" },
    { title: "Coordination des prestataires",      desc: "Traiteur, éclairagiste, sonorisation, fleuriste — un interlocuteur" },
    { title: "Montage & démontage",                desc: "Suivi sur site, réception des travaux, remise en état" },
  ],
}

const SERVICES_EN = {
  A: [
    { title: "Sketch & feasibility",          desc: "Site reading, architectural parti, volumetric study" },
    { title: "Preliminary design",             desc: "Plans, sections, elevations, design statement, rough estimate" },
    { title: "Planning application",           desc: "Compilation and submission of the full regulatory file" },
    { title: "Construction drawings",          desc: "Detailed technical drawings issued to contractors" },
    { title: "Contractor tendering",           desc: "Invitation to tender, quote analysis, contractor selection" },
    { title: "Site management",                desc: "Site meetings, snagging, works completion sign-off" },
  ],
  C: [
    { title: "Diagnosis & survey",             desc: "Condition assessment, geometric survey, historical analysis" },
    { title: "Heritage study",                 desc: "Identification of elements to preserve, reference documentation" },
    { title: "Restoration project",            desc: "Design approach, compatible techniques, original materials" },
    { title: "Specialist coordination",        desc: "Craftspeople, restorers, analysis laboratories" },
    { title: "Heritage site supervision",      desc: "Compliance control against preservation requirements" },
    { title: "Adaptive reuse",                 desc: "Contemporary programme integrated within a historic shell" },
  ],
  L: [
    { title: "Site analysis & landscape study", desc: "Terrain reading, sunlight, existing vegetation" },
    { title: "Outdoor space design",            desc: "Site plans, ground treatment, outdoor furniture" },
    { title: "Water integration",               desc: "Pool, basin, canal, wet patio — water as the guiding thread" },
    { title: "Planting plans",                  desc: "Species selection, rhythms, plant palette coherent with the site" },
    { title: "Implementation supervision",      desc: "Coordination with the landscape contractor, quality control" },
    { title: "Maintenance & upkeep",            desc: "Seasonal recommendations, long-term management protocol" },
  ],
  D: [
    { title: "Brief & research",               desc: "Formal exploration, references, moodboard, project framing" },
    { title: "Design & modelling",             desc: "Technical drawing, 3D rendering, prototype, production plans" },
    { title: "Production follow-up",           desc: "Coordination with craftspeople and workshops, milestone validation" },
    { title: "Art direction",                  desc: "Visual consistency across the project, design arbitration" },
    { title: "Visual identity",                desc: "Logo, brand guidelines, typography, palette — from brand to space" },
    { title: "Delivery & installation",        desc: "On-site setup, final adjustments, documentation" },
  ],
  E: [
    { title: "Scenography & concept",          desc: "Spatial narrative, ambiance, visitor or guest journey" },
    { title: "Layout plans",                   desc: "Site organisation, circulation flows, functional zones" },
    { title: "Temporary structures",           desc: "Tents, pavilions, stages, canopies — for the duration of an event" },
    { title: "Art direction",                  desc: "Visual consistency, signage, lighting, scenic dressing" },
    { title: "Supplier coordination",          desc: "Caterer, lighting designer, sound, florist — one point of contact" },
    { title: "Build & strike",                 desc: "On-site supervision, works sign-off, site restoration" },
  ],
}

const SERVICES_ES = {
  A: [
    { title: "Boceto & viabilidad",            desc: "Lectura del sitio, partido arquitectónico, estudio de volumetría" },
    { title: "Anteproyecto",                   desc: "Planos, secciones, alzados, memoria descriptiva, presupuesto estimado" },
    { title: "Solicitud de licencia",          desc: "Elaboración y presentación del expediente reglamentario completo" },
    { title: "Planos de ejecución",            desc: "Planos técnicos detallados entregados a las empresas constructoras" },
    { title: "Licitación de contratistas",     desc: "Concurso de ofertas, análisis de presupuestos, selección de intervenientes" },
    { title: "Dirección y seguimiento de obra", desc: "Reuniones de obra, levantamiento de reservas, recepción de trabajos" },
  ],
  C: [
    { title: "Diagnóstico & levantamiento",    desc: "Estado sanitario, levantamiento geométrico, análisis histórico del edificio" },
    { title: "Estudio patrimonial",            desc: "Identificación de elementos a conservar, documentación de referencia" },
    { title: "Proyecto de restauración",       desc: "Partido, técnicas compatibles, materiales originales" },
    { title: "Coordinación de especialistas",  desc: "Artesanos, restauradores, laboratorios de análisis" },
    { title: "Seguimiento de obra patrimonial", desc: "Control de conformidad con los requisitos de preservación" },
    { title: "Reconversión adaptativa",        desc: "Programa contemporáneo integrado en una envolvente histórica" },
  ],
  L: [
    { title: "Análisis del sitio & estudio paisajístico", desc: "Lectura del terreno, soleamiento, vegetación existente" },
    { title: "Diseño de espacios exteriores",  desc: "Planos de masa, tratamiento de suelos, mobiliario exterior" },
    { title: "Integración del agua",           desc: "Piscina, estanque, canal, patio húmedo — el agua como hilo conductor" },
    { title: "Planos de plantación",           desc: "Elección de especies, ritmos, paleta vegetal coherente con el sitio" },
    { title: "Seguimiento de ejecución",       desc: "Coordinación con el paisajista, control de calidad" },
    { title: "Mantenimiento",                  desc: "Recomendaciones estacionales, protocolo de gestión a largo plazo" },
  ],
  D: [
    { title: "Brief & investigación",          desc: "Exploración formal, referencias, moodboard, encuadre del proyecto" },
    { title: "Diseño & modelado",              desc: "Dibujo técnico, render 3D, prototipo, planos de fabricación" },
    { title: "Seguimiento de fabricación",     desc: "Coordinación con artesanos y talleres, validación de etapas" },
    { title: "Dirección artística",            desc: "Coherencia visual en todo el proyecto, arbitraje de decisiones" },
    { title: "Identidad visual",               desc: "Logo, manual de marca, tipografía, paleta — de la marca al espacio" },
    { title: "Entrega e instalación",          desc: "Puesta en obra, ajustes finales, documentación" },
  ],
  E: [
    { title: "Escenografía & concepto",        desc: "Narrativa espacial, ambiente, recorrido del visitante o invitado" },
    { title: "Planos de implantación",         desc: "Organización del sitio, flujos de circulación, zonas funcionales" },
    { title: "Estructuras temporales",         desc: "Carpas, pabellones, tarimas, doseles — por la duración de un evento" },
    { title: "Dirección artística",            desc: "Coherencia visual, señalética, iluminación, decoración escénica" },
    { title: "Coordinación de proveedores",    desc: "Catering, iluminador, sonido, florista — un único interlocutor" },
    { title: "Montaje & desmontaje",           desc: "Seguimiento en obra, recepción de trabajos, restauración del sitio" },
  ],
}

const DISC_LABELS = { C: 'Conservation', L: 'Landscape', A: 'Architecture', D: 'Design', E: 'Éphémère' }

function Chevron({ color }) {
  return (
    <svg width={7} height={13} viewBox="0 0 7 13"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, marginTop: 4, transition: 'stroke 0.35s ease' }}
    >
      <polyline points="1,1 6,6.5 1,12" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceCard({ service, index, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(8,9,10,0.95)' : 'rgba(8,9,10,0.82)',
        border: `1px solid ${hovered ? color : color + '30'}`,
        padding: 'clamp(28px, 3vw, 44px)',
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.35s ease, background 0.35s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14,
      }}>
        <Chevron color={hovered ? color : 'rgba(245,240,234,0.2)'} />
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(18px, 1.7vw, 23px)',
          fontWeight: 400,
          color: hovered ? '#F5F0EA' : 'rgba(245,240,234,0.75)',
          lineHeight: 1.3,
          transition: 'color 0.35s ease',
        }}>
          {service.title}
        </div>
      </div>

      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 13, lineHeight: 1.85,
        color: 'rgba(245,240,234,0.45)',
        flex: 1,
      }}>
        {service.desc}
      </div>
    </motion.div>
  )
}

export default function DisciplinePage() {
  const { key }  = useParams()
  const navigate = useNavigate()
  const K        = key?.toUpperCase()
  const axis     = AXES[K]

  const [phraseIdx, setPhraseIdx]     = useState(0)
  const [contactOpen, setContactOpen] = useState(false)
  const { t, lang } = useLanguage()
  const { projects }                  = useProjects(K)
  const phrasesFromDB                 = useSiteContentJson(`discipline.${K}.phrases`, PHRASES[K] ?? [])
  const phrasesBase                   = phrasesFromDB.length ? phrasesFromDB : (PHRASES[K] ?? [])
  const phrases                       = lang === 'en' ? (PHRASES_EN[K] ?? phrasesBase)
                                      : lang === 'es' ? (PHRASES_ES[K] ?? phrasesBase)
                                      : phrasesBase
  const heroImage                     = useSiteContent(`discipline.${K}.hero_image`, HERO_IMAGES[K] ?? '')
  const servicesBase                  = lang === 'en' ? (SERVICES_EN[K] ?? SERVICES[K] ?? [])
                                      : lang === 'es' ? (SERVICES_ES[K] ?? SERVICES[K] ?? [])
                                      : (SERVICES[K] ?? [])
  const services                      = servicesBase

  useEffect(() => {
    if (!axis) { navigate('/'); return }
    if (phrases.length < 2) return
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % phrases.length), 4500)
    return () => clearInterval(id)
  }, [K, axis, navigate, phrases.length])

  if (!axis) return null

  const color = axis.color

  return (
    <PageTransition style={{ background: '#08090A', minHeight: '100vh', color: '#F5F0EA' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 clamp(2rem, 6vw, 7rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,9,10,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${color}20`,
      }}>
        <AnimatedLogo disciplineKey={K} disciplineLabel={t('disc.' + K + '.label')} color={color} />

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
            letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.35)',
            transition: 'color 0.2s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F0EA'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,234,0.35)'}
        >
          {t('back')}
        </button>
      </nav>

      {/* ── HERO image ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        className="img-shimmer"
        style={{ position: 'relative', height: '52vh', minHeight: 420, overflow: 'hidden' }}
      >
        <LazyBg
          src={heroImage}
          data-cms-key={`discipline.${K}.hero_image`}
          data-cms-type="image"
          data-cms-value={heroImage}
          style={{
            position: 'absolute', inset: 0,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.65) saturate(0.72)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, #08090A 0%, ${color}12 50%, transparent 100%)`,
        }} />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 1,
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </motion.section>

      {/* ── TEXTE ANIMÉ (même style que Hero) ── */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 9vw, 7rem) clamp(2rem, 6vw, 7rem)',
          borderBottom: '1px solid rgba(245,240,234,0.06)',
        }}
      >
        <div
          data-cms-key={`discipline.${K}.phrases`}
          data-cms-type="json-phrases"
          data-cms-value={JSON.stringify(phrases)}
          style={{ marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIdx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 400, lineHeight: 1,
                color: '#F5F0EA', letterSpacing: '-0.025em',
              }}>
                {phrases[phraseIdx]?.line1}
              </div>
              <div style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 400, fontStyle: 'italic',
                lineHeight: 1.05, letterSpacing: '-0.025em',
                color: 'rgba(245,240,234,0.35)',
              }}>
                {phrases[phraseIdx]?.line2}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicateurs */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {phrases.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhraseIdx(i)}
              style={{
                width: i === phraseIdx ? 28 : 6,
                height: 1,
                background: i === phraseIdx ? color : 'rgba(245,240,234,0.18)',
                border: 'none', padding: 0,
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* ── MISSIONS ── */}
      <section style={{
        background: `${color}18`,
        padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem)',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(3rem, 5vw, 5rem)' }}
        >
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
            letterSpacing: 3.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.3)',
          }}>
            {t('disc.missions_label')}
          </span>
          <h2 style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(26px, 3.5vw, 46px)',
            fontWeight: 400, color: '#F5F0EA',
            marginTop: 10, lineHeight: 1,
          }}>
            {t('disc.missions_title')} <em style={{ color: color }}>{t('disc.missions_em')}</em>
          </h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
          gap: 'clamp(10px, 1.2vw, 16px)',
        }}>
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} index={i} color={color} />
          ))}
        </div>
      </section>

      {/* ── PROJETS ── */}
      <motion.section
        id="projets"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem)' }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: 'rgba(245,240,234,0.25)' }}>
            {t('disc.works')}
          </span>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 400, color: '#F5F0EA', marginTop: 10, lineHeight: 1 }}>
            {t('disc.projects_prefix')}
            <em style={{ color, fontStyle: 'italic' }}>{t('disc.' + K + '.label')}</em>
            {t('disc.projects_suffix')}
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
          gap: 3,
        }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/projet/${project.id}`)}
              className="img-shimmer"
              style={{ position: 'relative', overflow: 'hidden', height: 340, cursor: 'pointer' }}
            >
              <LazyBg
                src={project.image}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.65) saturate(0.75)',
                  transition: 'transform 0.7s, filter 0.4s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(0.82) saturate(0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'brightness(0.65) saturate(0.75)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, rgba(8,9,10,0.95) 0%, ${color}10 60%, transparent 100%)`,
              }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color + '50' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28 }}>
                {(() => {
                  const tr = lang !== 'fr' ? (project.translations?.[lang] || {}) : {}
                  return (<>
                    <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: '#F5F0EA', lineHeight: 1.15, margin: '0 0 8px' }}>
                      {tr.title || project.title}
                    </h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.4)', letterSpacing: 0.3 }}>{project.location}</span>
                      <span style={{ width: 1, height: 8, background: 'rgba(245,240,234,0.15)' }} />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(245,240,234,0.25)', letterSpacing: 1 }}>{project.year}</span>
                    </div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, lineHeight: 1.65, color: 'rgba(245,240,234,0.4)' }}>
                      {tr.description || project.description}
                    </p>
                  </>)
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
        margin: '0 clamp(2rem, 6vw, 7rem) clamp(4rem, 8vw, 7rem)',
        padding: 'clamp(3rem, 6vw, 5rem)',
        border: `1px solid ${color}22`,
        borderRadius: 4,
        background: `${color}06`,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24,
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3.5, textTransform: 'uppercase', color: color + 'aa' }}>
          {t('disc.cta_supertitle')}
        </span>
        <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 400, color: '#F5F0EA', lineHeight: 1.1 }}>
          {t('disc.cta_line1', t('disc.' + K + '.label'))}<br />
          <em style={{ color: 'rgba(245,240,234,0.3)' }}>{t('disc.cta_line2')}</em>
        </h3>
        <button
          onClick={() => setContactOpen(true)}
          style={{
            background: color, color: '#08090A',
            border: 'none', borderRadius: 40,
            padding: '14px 32px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}40` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {t('disc.cta_btn')}
        </button>
      </motion.section>

      <QuickContact open={contactOpen} onClose={() => setContactOpen(false)} />

    </PageTransition>
  )
}
