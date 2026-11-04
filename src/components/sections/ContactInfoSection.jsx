import { motion } from 'framer-motion'
import { useSiteContent } from '../../context/SiteContentContext'
import { useLanguage } from '../../context/LanguageContext'

const LABELS = {
  fr: { phone: 'Téléphone', address: 'Adresse', hours: 'Horaires', follow: 'Suivez-nous' },
  en: { phone: 'Phone', address: 'Address', hours: 'Hours', follow: 'Follow us' },
  es: { phone: 'Teléfono', address: 'Dirección', hours: 'Horario', follow: 'Síguenos' },
}

const ICON_INSTAGRAM = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const ICON_TIKTOK = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)
const ICON_LINKEDIN = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)
const ICON_FACEBOOK = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

function SocialLink({ href, icon, label }) {
  if (!href || href === '#') return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40,
        border: '1px solid rgba(245,240,234,0.12)',
        borderRadius: '50%',
        color: 'rgba(245,240,234,0.4)',
        textDecoration: 'none',
        transition: 'color 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#C8B89A'; e.currentTarget.style.borderColor = 'rgba(200,184,154,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.4)'; e.currentTarget.style.borderColor = 'rgba(245,240,234,0.12)' }}
    >
      {icon}
    </a>
  )
}

function InfoBlock({ label, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <span style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 9, letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(245,240,234,0.25)',
      }}>
        {label}
      </span>
      {children}
    </motion.div>
  )
}

export default function ContactInfoSection() {
  const { lang } = useLanguage()
  const labels = LABELS[lang] || LABELS.fr

  const phone   = useSiteContent('contact.phone',   '+212 6 00 00 00 00')
  const address = useSiteContent('contact.address',  'Casablanca, Maroc')
  const hours   = useSiteContent('contact.hours',    'Lun – Ven, 9h – 18h')
  const instagram = useSiteContent('contact.social.instagram', '#')
  const tiktok    = useSiteContent('contact.social.tiktok',    '#')
  const linkedin  = useSiteContent('contact.social.linkedin',  '#')
  const facebook  = useSiteContent('contact.social.facebook',  '#')

  return (
    <section style={{
      borderTop: '1px solid rgba(245,240,234,0.06)',
      background: '#08090A',
      padding: 'clamp(3.5rem, 6vw, 5rem) clamp(2rem, 6vw, 7rem)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(2.5rem, 4vw, 4rem)',
        alignItems: 'start',
      }}>

        {/* Téléphone */}
        <InfoBlock label={labels.phone} delay={0}>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              color: 'rgba(245,240,234,0.75)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F5F0EA' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.75)' }}
          >
            {phone}
          </a>
        </InfoBlock>

        {/* Adresse */}
        <InfoBlock label={labels.address} delay={0.07}>
          <span style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(245,240,234,0.75)',
            lineHeight: 1.4,
          }}>
            {address}
          </span>
        </InfoBlock>

        {/* Horaires */}
        <InfoBlock label={labels.hours} delay={0.14}>
          <span style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(245,240,234,0.75)',
            lineHeight: 1.4,
          }}>
            {hours}
          </span>
        </InfoBlock>

        {/* Réseaux sociaux */}
        <InfoBlock label={labels.follow} delay={0.21}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SocialLink href={instagram} icon={ICON_INSTAGRAM} label="Instagram" />
            <SocialLink href={tiktok}    icon={ICON_TIKTOK}    label="TikTok" />
            <SocialLink href={linkedin}  icon={ICON_LINKEDIN}  label="LinkedIn" />
            <SocialLink href={facebook}  icon={ICON_FACEBOOK}  label="Facebook" />
          </div>
        </InfoBlock>

      </div>
    </section>
  )
}
