import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

const ACCENT = '#C8B89A'

const ITEMS = {
  fr: [
    {
      num: '01',
      title: 'Suivi en temps réel',
      body: 'Accédez à votre espace projet où que vous soyez. Documents, avancement, échanges — tout est centralisé dans un portail dédié, accessible depuis n\'importe quel appareil.',
    },
    {
      num: '02',
      title: 'Respect des délais',
      body: 'Chaque mission suit un planning détaillé avec des jalons précis. Vous êtes informé à chaque étape, sans attendre.',
    },
    {
      num: '03',
      title: 'Transparence totale',
      body: 'Budgets, livrables, comptes-rendus de réunion : aucune décision ne vous échappe. La confiance s\'installe dans les détails.',
    },
    {
      num: '04',
      title: '5 disciplines, un seul regard',
      body: 'Architecture, paysage, design intérieur, scénographie, éphémère. Une vision cohérente, une équipe, un interlocuteur.',
    },
    {
      num: '05',
      title: 'Sur mesure, toujours',
      body: 'Vos contraintes deviennent notre grille de lecture. Chaque projet naît d\'une écoute attentive — chaque solution est singulière.',
    },
  ],
  en: [
    {
      num: '01',
      title: 'Real-time tracking',
      body: 'Access your project space from anywhere. Documents, progress, exchanges — all centralized in a dedicated portal, accessible from any device.',
    },
    {
      num: '02',
      title: 'On-time delivery',
      body: 'Every project follows a detailed schedule with precise milestones. You are informed at every step, without waiting.',
    },
    {
      num: '03',
      title: 'Full transparency',
      body: 'Budgets, deliverables, meeting notes: no decision escapes you. Trust is built in the details.',
    },
    {
      num: '04',
      title: '5 disciplines, one vision',
      body: 'Architecture, landscape, interior design, scenography, ephemeral. A coherent vision, one team, one point of contact.',
    },
    {
      num: '05',
      title: 'Always bespoke',
      body: 'Your constraints become our framework. Every project is born from careful listening — every solution is unique.',
    },
  ],
  es: [
    {
      num: '01',
      title: 'Seguimiento en tiempo real',
      body: 'Acceda a su espacio de proyecto desde cualquier lugar. Documentos, avances, intercambios — todo centralizado en un portal dedicado.',
    },
    {
      num: '02',
      title: 'Respeto de los plazos',
      body: 'Cada proyecto sigue un cronograma detallado con hitos precisos. Usted es informado en cada etapa, sin esperar.',
    },
    {
      num: '03',
      title: 'Transparencia total',
      body: 'Presupuestos, entregables, actas de reunión: ninguna decisión le escapa. La confianza se construye en los detalles.',
    },
    {
      num: '04',
      title: '5 disciplinas, una sola visión',
      body: 'Arquitectura, paisaje, diseño interior, escenografía, efímero. Una visión coherente, un equipo, un interlocutor.',
    },
    {
      num: '05',
      title: 'Siempre a medida',
      body: 'Sus limitaciones se convierten en nuestro marco. Cada proyecto nace de una escucha atenta — cada solución es singular.',
    },
  ],
}

const HEADING = {
  fr: { sup: 'Pourquoi nous choisir', h2a: 'Une architecture', h2b: 'de confiance.', sub: 'Chaque projet mérite une attention totale — du premier croquis à la livraison finale.' },
  en: { sup: 'Why choose us', h2a: 'An architecture', h2b: 'of trust.', sub: 'Every project deserves total attention — from the first sketch to final delivery.' },
  es: { sup: 'Por qué elegirnos', h2a: 'Una arquitectura', h2b: 'de confianza.', sub: 'Cada proyecto merece atención total — del primer boceto a la entrega final.' },
}

const PORTAL = {
  fr: { label: 'Portail client', title: 'Suivez votre projet,\nou que vous soyez.', body: 'Chaque client dispose d\'un espace personnel : documents, livrables, avancement et échanges — réunis en un seul endroit, disponible 24h/24.' },
  en: { label: 'Client portal', title: 'Follow your project,\nwherever you are.', body: 'Every client has a personal space: documents, deliverables, progress and exchanges — gathered in one place, available 24/7.' },
  es: { label: 'Portal del cliente', title: 'Siga su proyecto,\ndonde quiera que esté.', body: 'Cada cliente tiene un espacio personal: documentos, entregables, avance e intercambios — reunidos en un solo lugar, disponible 24h.' },
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

function FeatureRow({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      {...fadeUp(index * 0.08)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', cursor: 'default' }}
    >
      {/* Top divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1,
          background: hovered
            ? `linear-gradient(to right, ${ACCENT}, rgba(200,184,154,0.15))`
            : 'rgba(245,240,234,0.07)',
          transformOrigin: 'left',
          transition: 'background 0.4s ease',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr 1fr',
        gap: 'clamp(1rem, 3vw, 3rem)',
        padding: 'clamp(1.4rem, 3vw, 2.2rem) 0',
        alignItems: 'start',
        transition: 'opacity 0.3s',
        opacity: hovered ? 1 : 0.75,
      }}>
        {/* Number */}
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(13px, 2vw, 16px)',
          color: hovered ? ACCENT : 'rgba(245,240,234,0.25)',
          letterSpacing: '0.05em',
          paddingTop: 3,
          transition: 'color 0.35s ease',
        }}>
          {item.num}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(17px, 2.2vw, 22px)',
          fontWeight: 400,
          color: hovered ? '#F5F0EA' : 'rgba(245,240,234,0.85)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          transition: 'color 0.3s ease',
        }}>
          {item.title}
        </div>

        {/* Body */}
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(11px, 1.2vw, 13px)',
          color: 'rgba(245,240,234,0.38)',
          lineHeight: 1.75,
          letterSpacing: '0.01em',
          maxWidth: 380,
        }}>
          {item.body}
        </div>
      </div>

      {/* Accent left bar on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scaleY: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          left: -1,
          top: 0,
          bottom: 0,
          width: 1,
          background: ACCENT,
          transformOrigin: 'top',
        }}
      />
    </motion.div>
  )
}

export default function WhyUsSection() {
  const { lang } = useLanguage()
  const items   = ITEMS[lang] || ITEMS.fr
  const h       = HEADING[lang] || HEADING.fr
  const portal  = PORTAL[lang] || PORTAL.fr

  return (
    <section id="pourquoi" style={{
      background: '#08090A',
      padding: 'clamp(5rem, 12vw, 10rem) clamp(2rem, 6vw, 7rem)',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 6rem)',
        marginBottom: 'clamp(3rem, 7vw, 6rem)',
        alignItems: 'end',
      }}>
        <div>
          <motion.div {...fadeUp(0)} style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: 20,
          }}>
            {h.sup}
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <div style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(38px, 6vw, 80px)',
              fontWeight: 400,
              lineHeight: 1.0,
              color: '#F5F0EA',
              letterSpacing: '-0.02em',
            }}>
              {h.h2a}
            </div>
            <div style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(38px, 6vw, 80px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.0,
              color: 'rgba(245,240,234,0.35)',
              letterSpacing: '-0.02em',
            }}>
              {h.h2b}
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.15)} style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(12px, 1.3vw, 15px)',
          color: 'rgba(245,240,234,0.38)',
          lineHeight: 1.8,
          maxWidth: 380,
          alignSelf: 'end',
          paddingBottom: 6,
        }}>
          {h.sub}
        </motion.div>
      </div>

      {/* ── Feature rows ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {items.map((item, i) => (
          <FeatureRow key={item.num} item={item} index={i} />
        ))}
        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: 'rgba(245,240,234,0.07)', transformOrigin: 'left' }}
        />
      </div>

      {/* ── Portal highlight ──────────────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.1)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(245,240,234,0.07)',
          borderRadius: 20,
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT}10 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 12px',
            borderRadius: 100,
            border: `1px solid ${ACCENT}40`,
            background: `${ACCENT}0D`,
            marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}>
              {portal.label}
            </span>
          </div>

          <div style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(22px, 3.5vw, 42px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#F5F0EA',
            letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
          }}>
            {portal.title}
          </div>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(12px, 1.2vw, 14px)',
          color: 'rgba(245,240,234,0.4)',
          lineHeight: 1.8,
        }}>
          {portal.body}

          {/* Device icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 28,
          }}>
            {[
              { label: 'Mobile', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2"/>
                </svg>
              )},
              { label: 'Desktop', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              )},
              { label: 'Tablette', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2"/>
                </svg>
              )},
            ].map(({ label, icon }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 11,
                color: 'rgba(245,240,234,0.3)',
                letterSpacing: '0.06em',
              }}>
                <span style={{ color: 'rgba(245,240,234,0.2)' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          #pourquoi [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #pourquoi [style*="grid-template-columns: 64px 1fr 1fr"] {
            grid-template-columns: 40px 1fr !important;
          }
          #pourquoi [style*="grid-template-columns: 64px 1fr 1fr"] > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
