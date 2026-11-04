import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

const ACCENT = '#C8B89A'

const FAQ = {
  fr: {
    sup: 'Questions fréquentes',
    h2a: 'Ce que vous',
    h2b: 'nous demandez.',
    items: [
      {
        q: 'Comment se déroule une première prise de contact ?',
        a: 'Remplissez notre formulaire ou écrivez-nous directement. Nous prenons le temps d\'un premier échange pour comprendre votre projet avant de vous proposer une mission adaptée — sans engagement de votre part.',
      },
      {
        q: 'Travaillez-vous avec des particuliers et des professionnels ?',
        a: 'Oui. Nos clients sont aussi bien des particuliers porteurs d\'un projet de rénovation ou de construction que des entreprises, institutions ou collectivités qui cherchent une expertise pluridisciplinaire.',
      },
      {
        q: 'Intervenez-vous hors de France ?',
        a: 'Nous intervenons principalement en France et dans les pays francophones, mais nous acceptons des projets à l\'international selon leur nature et leur envergure. Contactez-nous pour en discuter.',
      },
      {
        q: 'Comment sont calculés vos honoraires ?',
        a: 'Nos honoraires dépendent de la nature de la mission, de sa complexité et de son étendue. Nous établissons systématiquement un devis détaillé après un premier échange, sans surprise.',
      },
      {
        q: 'Pouvez-vous reprendre un projet déjà commencé ?',
        a: 'Oui, dans certaines conditions. Nous analysons d\'abord l\'état du projet existant pour évaluer la faisabilité d\'une reprise et vous proposer les meilleures conditions de continuité.',
      },
      {
        q: 'Quelle est la durée moyenne d\'un projet ?',
        a: 'Elle varie selon la discipline et la complexité : de quelques semaines pour un projet éphémère à plusieurs années pour une restauration patrimoniale. Un planning détaillé vous est communiqué dès le démarrage.',
      },
    ],
  },
  en: {
    sup: 'Frequently asked',
    h2a: 'What you',
    h2b: 'ask us.',
    items: [
      {
        q: 'How does the first contact work?',
        a: 'Fill in our form or write to us directly. We always start with a conversation to understand your project before proposing a scope — with no commitment on your part.',
      },
      {
        q: 'Do you work with private clients and businesses?',
        a: 'Yes. Our clients include private individuals with renovation or construction projects as well as companies, institutions and public bodies looking for multidisciplinary expertise.',
      },
      {
        q: 'Do you work internationally?',
        a: 'We work primarily in France and French-speaking countries, but we take on international projects depending on their nature and scale. Contact us to discuss.',
      },
      {
        q: 'How are your fees calculated?',
        a: 'Our fees depend on the scope, complexity and nature of the assignment. We always provide a detailed quote after an initial discussion — no surprises.',
      },
      {
        q: 'Can you take over a project started by another firm?',
        a: 'Yes, in some cases. We first assess the existing project to determine whether a handover is feasible and propose the best conditions for continuity.',
      },
      {
        q: 'How long does a typical project take?',
        a: 'It varies by discipline and complexity — from a few weeks for an ephemeral project to several years for a heritage restoration. We provide a detailed schedule from the very start.',
      },
    ],
  },
  es: {
    sup: 'Preguntas frecuentes',
    h2a: 'Lo que nos',
    h2b: 'preguntan.',
    items: [
      {
        q: '¿Cómo funciona el primer contacto?',
        a: 'Rellene nuestro formulario o escríbanos directamente. Siempre comenzamos con una conversación para entender su proyecto antes de proponer un alcance — sin compromiso de su parte.',
      },
      {
        q: '¿Trabajan con particulares y con empresas?',
        a: 'Sí. Nuestros clientes incluyen particulares con proyectos de renovación o construcción, así como empresas, instituciones y organismos públicos que buscan una experiencia pluridisciplinar.',
      },
      {
        q: '¿Intervienen fuera de Francia?',
        a: 'Trabajamos principalmente en Francia y en países francófonos, pero aceptamos proyectos internacionales según su naturaleza y envergadura. Contáctenos para hablarlo.',
      },
      {
        q: '¿Cómo se calculan sus honorarios?',
        a: 'Nuestros honorarios dependen del alcance, la complejidad y la naturaleza del encargo. Siempre elaboramos un presupuesto detallado tras un primer intercambio — sin sorpresas.',
      },
      {
        q: '¿Pueden retomar un proyecto iniciado por otro estudio?',
        a: 'Sí, en algunos casos. Primero analizamos el estado del proyecto existente para evaluar la viabilidad de la retoma y proponer las mejores condiciones de continuidad.',
      },
      {
        q: '¿Cuánto dura un proyecto en promedio?',
        a: 'Varía según la disciplina y la complejidad: de unas pocas semanas para un proyecto efímero a varios años para una restauración patrimonial. Le comunicamos un calendario detallado desde el inicio.',
      },
    ],
  },
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderBottom: '1px solid rgba(245,240,234,0.08)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: 'clamp(20px, 2.5vw, 28px) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(17px, 1.8vw, 22px)',
          fontWeight: 400,
          color: open ? '#F5F0EA' : 'rgba(245,240,234,0.7)',
          lineHeight: 1.3,
          transition: 'color 0.3s ease',
        }}>
          {item.q}
        </span>

        {/* Chevron */}
        <svg
          width={16} height={16} viewBox="0 0 16 16" fill="none"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <line x1="8" y1="2" x2="8" y2="14" stroke={open ? ACCENT : 'rgba(245,240,234,0.3)'} strokeWidth="1.4" strokeLinecap="round" style={{ transition: 'stroke 0.3s ease' }} />
          <line x1="2" y1="8" x2="14" y2="8" stroke={open ? ACCENT : 'rgba(245,240,234,0.3)'} strokeWidth="1.4" strokeLinecap="round" style={{ transition: 'stroke 0.3s ease' }} />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              lineHeight: 1.85,
              color: 'rgba(245,240,234,0.5)',
              paddingBottom: 'clamp(20px, 2.5vw, 28px)',
              maxWidth: 680,
            }}>
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FaqSection() {
  const { lang } = useLanguage()
  const faq = FAQ[lang] || FAQ.fr

  return (
    <section style={{
      background: '#08090A',
      padding: 'clamp(5rem, 10vw, 9rem) clamp(2rem, 6vw, 7rem)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
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
            {faq.sup}
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
              {faq.h2a}
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
              {faq.h2b}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Accordion */}
      <div style={{ maxWidth: 900 }}>
        {faq.items.map((item, i) => (
          <FaqItem key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
