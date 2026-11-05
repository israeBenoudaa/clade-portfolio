import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

const ACCENT = '#C8B89A'

const CARDS = {
  fr: [
    {
      num: '01',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      ),
      title: 'Suivi en temps réel',
      body: 'Accédez à votre espace projet depuis n\'importe quel appareil. Documents, avancement, échanges — tout centralisé, disponible 24h/24. Votre espace dédié sur l\'application de gestion Clade vous accompagne à chaque étape du projet.',
      from: { x: -40, y: 24 },
    },
    {
      num: '02',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Respect des délais',
      body: 'Chaque mission suit un planning rigoureux avec des jalons clairs. Vous savez en permanence où en est votre projet.',
      from: { x: 40, y: 24 },
    },
    {
      num: '03',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      title: 'Transparence totale',
      body: 'Budgets, livrables, comptes-rendus : aucune décision ne vous échappe. La confiance se construit dans les détails.',
      from: { x: -40, y: 24 },
    },
    {
      num: '04',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      title: 'Sur mesure, toujours',
      body: 'Vos contraintes deviennent notre grille de lecture. Chaque projet naît d\'une écoute attentive — chaque solution est singulière.',
      from: { x: 40, y: 24 },
    },
  ],
  en: [
    {
      num: '01',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
      title: 'Real-time tracking',
      body: 'Access your project space from any device. Documents, progress, exchanges — all centralized, available 24/7. Your dedicated space on the Clade management application keeps you informed at every step.',
      from: { x: -40, y: 24 },
    },
    {
      num: '02',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      title: 'On-time delivery',
      body: 'Every project follows a rigorous schedule with clear milestones. You always know where your project stands.',
      from: { x: 40, y: 24 },
    },
    {
      num: '03',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
      title: 'Full transparency',
      body: 'Budgets, deliverables, meeting notes: no decision escapes you. Trust is built through the details.',
      from: { x: -40, y: 24 },
    },
    {
      num: '04',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
      title: 'Always bespoke',
      body: 'Your constraints become our framework. Every project is born from careful listening — every solution is unique.',
      from: { x: 40, y: 24 },
    },
  ],
  es: [
    {
      num: '01',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
      title: 'Seguimiento en tiempo real',
      body: 'Acceda a su espacio de proyecto desde cualquier dispositivo. Documentos, avance, intercambios — todo centralizado, disponible 24h. Su espacio dedicado en la aplicación de gestión Clade le acompaña en cada etapa del proyecto.',
      from: { x: -40, y: 24 },
    },
    {
      num: '02',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      title: 'Respeto de los plazos',
      body: 'Cada proyecto sigue un calendario riguroso con hitos claros. Siempre sabe dónde está su proyecto.',
      from: { x: 40, y: 24 },
    },
    {
      num: '03',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
      title: 'Transparencia total',
      body: 'Presupuestos, entregables, actas: ninguna decisión le escapa. La confianza se construye en los detalles.',
      from: { x: -40, y: 24 },
    },
    {
      num: '04',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
      title: 'Siempre a medida',
      body: 'Sus limitaciones se convierten en nuestro marco. Cada proyecto nace de una escucha atenta — cada solución es singular.',
      from: { x: 40, y: 24 },
    },
  ],
}

const HEADING = {
  fr: { sup: 'Pourquoi nous choisir', h2a: 'Ce qui nous', h2b: 'distingue.' },
  en: { sup: 'Why choose us',         h2a: 'What sets',  h2b: 'us apart.'  },
  es: { sup: 'Por qué elegirnos',     h2a: 'Lo que nos', h2b: 'distingue.' },
}

function Card({ card, index, active, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered || active

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
      style={{
        background: lit ? `${ACCENT}28` : `${ACCENT}18`,
        border: `1px solid ${lit ? ACCENT : `${ACCENT}28`}`,
        padding: 'clamp(1.6rem, 3vw, 2.6rem)',
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 0.35s ease, background 0.35s ease',
        cursor: 'pointer',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 42, height: 42,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: lit ? ACCENT : `${ACCENT}45`,
        marginBottom: 22,
        transition: 'color 0.35s ease',
      }}>
        {card.icon}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Instrument Serif, serif',
        fontSize: 'clamp(18px, 1.9vw, 23px)',
        fontWeight: 400,
        color: lit ? '#F5F0EA' : 'rgba(245,240,234,0.75)',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        marginBottom: 14,
        transition: 'color 0.35s ease',
      }}>
        {card.title}
      </div>

      {/* Body */}
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 13,
        color: 'rgba(245,240,234,0.45)',
        lineHeight: 1.85,
        letterSpacing: '0.01em',
      }}>
        {card.body}
      </div>
    </motion.div>
  )
}

export default function WhyUsSection() {
  const { lang } = useLanguage()
  const cards   = CARDS[lang] || CARDS.fr
  const h       = HEADING[lang] || HEADING.fr
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <section id="pourquoi" style={{
      background: '#08090A',
      padding: 'clamp(5rem, 12vw, 9rem) clamp(2rem, 6vw, 7rem)',
      overflowX: 'hidden',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: 'clamp(3rem, 6vw, 5rem)',
      }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: ACCENT,
              marginBottom: 18,
            }}
          >
            {h.sup}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '80px' }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              display: 'block',
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(42px, 6.5vw, 88px)',
              fontWeight: 400,
              lineHeight: 0.95,
              color: '#F5F0EA',
              letterSpacing: '-0.025em',
            }}>
              {h.h2a}
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(42px, 6.5vw, 88px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.0,
              color: 'rgba(245,240,234,0.28)',
              letterSpacing: '-0.025em',
            }}>
              {h.h2b}
            </span>
          </motion.div>
        </div>

      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'clamp(10px, 1.2vw, 16px)',
      }}>
        {cards.map((card, i) => (
          <Card
            key={card.num} card={card} index={i}
            active={activeIdx === i}
            onToggle={() => setActiveIdx(activeIdx === i ? null : i)}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          #pourquoi [style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
