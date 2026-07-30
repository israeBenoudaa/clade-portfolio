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
      body: 'Accédez à votre espace projet depuis n\'importe quel appareil. Documents, avancement, échanges — tout centralisé, disponible 24h/24.',
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
      body: 'Access your project space from any device. Documents, progress, exchanges — all centralized, available 24/7.',
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
      body: 'Acceda a su espacio de proyecto desde cualquier dispositivo. Documentos, avance, intercambios — todo centralizado, disponible 24h.',
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

function Card({ card, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: card.from.x, y: card.from.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? `${ACCENT}35` : 'rgba(245,240,234,0.07)'}`,
        borderRadius: 20,
        padding: 'clamp(1.6rem, 3.5vw, 2.8rem)',
        overflow: 'hidden',
        transition: 'background 0.4s ease, border-color 0.4s ease, transform 0.4s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Ghost number */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        right: -4,
        fontFamily: 'Instrument Serif, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(90px, 14vw, 140px)',
        fontWeight: 400,
        lineHeight: 1,
        color: hovered ? `${ACCENT}12` : 'rgba(245,240,234,0.04)',
        userSelect: 'none',
        pointerEvents: 'none',
        transition: 'color 0.4s ease',
      }}>
        {card.num}
      </div>

      {/* Glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(to right, ${ACCENT}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 12,
        background: `${ACCENT}12`,
        border: `1px solid ${ACCENT}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? ACCENT : 'rgba(200,184,154,0.5)',
        marginBottom: 28,
        transition: 'color 0.35s ease, background 0.35s ease',
      }}>
        {card.icon}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Instrument Serif, serif',
        fontSize: 'clamp(18px, 2.2vw, 24px)',
        fontWeight: 400,
        fontStyle: hovered ? 'italic' : 'normal',
        color: hovered ? '#F5F0EA' : 'rgba(245,240,234,0.82)',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        marginBottom: 14,
        transition: 'color 0.3s ease, font-style 0.3s ease',
      }}>
        {card.title}
      </div>

      {/* Body */}
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(11px, 1.1vw, 13px)',
        color: 'rgba(245,240,234,0.35)',
        lineHeight: 1.8,
        letterSpacing: '0.01em',
        position: 'relative', zIndex: 1,
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

  return (
    <section id="pourquoi" style={{
      background: '#08090A',
      padding: 'clamp(5rem, 12vw, 9rem) clamp(2rem, 6vw, 7rem)',
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
            viewport={{ once: true }}
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
            viewport={{ once: true }}
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

        {/* Decorative counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(80px, 12vw, 160px)',
            fontWeight: 400,
            lineHeight: 1,
            color: 'rgba(245,240,234,0.03)',
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          04
        </motion.div>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
      }}>
        {cards.map((card, i) => (
          <Card key={card.num} card={card} index={i} />
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
