import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'

const DISCIPLINES = [
  { key: 'C', label: 'Conservation' },
  { key: 'L', label: 'Landscape' },
  { key: 'A', label: 'Architecture' },
  { key: 'D', label: 'Design' },
  { key: 'E', label: 'Éphémère' },
]

const NAV = {
  fr: [
    { label: 'Accueil',    path: '/' },
    { label: 'Projets',    path: '/#projets' },
    { label: 'Carrières',  path: '/careers' },
    { label: 'Contact',    path: '/#contact' },
  ],
  en: [
    { label: 'Home',       path: '/' },
    { label: 'Projects',   path: '/#projets' },
    { label: 'Careers',    path: '/careers' },
    { label: 'Contact',    path: '/#contact' },
  ],
  es: [
    { label: 'Inicio',     path: '/' },
    { label: 'Proyectos',  path: '/#projets' },
    { label: 'Carreras',   path: '/careers' },
    { label: 'Contacto',   path: '/#contact' },
  ],
}

const HEADINGS = {
  fr: { nav: 'Navigation', disc: 'Disciplines', contact: 'Contact' },
  en: { nav: 'Navigation', disc: 'Disciplines', contact: 'Contact' },
  es: { nav: 'Navegación', disc: 'Disciplinas', contact: 'Contacto' },
}

const linkStyle = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 12,
  letterSpacing: '0.08em',
  color: 'rgba(245,240,234,0.4)',
  textDecoration: 'none',
  textTransform: 'uppercase',
  transition: 'color 0.25s ease',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textAlign: 'left',
}

const colHead = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 9,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,234,0.22)',
  marginBottom: 20,
  display: 'block',
}

function IconPin() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
    </svg>
  )
}
function IconClock() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  tiktok: (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  ),
  linkedin: (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  facebook: (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
}

export default function Footer() {
  const year     = new Date().getFullYear()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()

  const phone     = useSiteContent('contact.phone',   '+212 6 00 00 00 00')
  const address   = useSiteContent('contact.address',  'Casablanca, Maroc')
  const hours     = useSiteContent('contact.hours',    'Lun – Ven, 9h – 18h')
  const instagram = useSiteContent('contact.social.instagram', '')
  const tiktok    = useSiteContent('contact.social.tiktok',    '')
  const linkedin  = useSiteContent('contact.social.linkedin',  '')
  const facebook  = useSiteContent('contact.social.facebook',  '')

  const nav      = NAV[lang] || NAV.fr
  const headings = HEADINGS[lang] || HEADINGS.fr

  const socials = [
    { key: 'instagram', href: instagram },
    { key: 'tiktok',    href: tiktok },
    { key: 'linkedin',  href: linkedin },
    { key: 'facebook',  href: facebook },
  ].filter(s => s.href && s.href !== '#' && s.href !== '')

  return (
    <footer style={{
      background: '#08090A',
      borderTop: '1px solid rgba(245,240,234,0.07)',
    }}>
      {/* ── Contenu principal ── */}
      <div style={{
        padding: 'clamp(3.5rem, 6vw, 5rem) clamp(2rem, 6vw, 7rem)',
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr',
        gap: 'clamp(2rem, 4vw, 5rem)',
        alignItems: 'start',
      }}>

        {/* Colonne 1 — Logo + tagline + réseaux */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.18em' }}>
            <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
              <span style={{ fontFamily: "'Averia Libre', serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.05em', color: '#F5F0EA', lineHeight: 1 }}>Clade</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 7.3, fontWeight: 500, color: 'rgba(245,240,234,0.4)', letterSpacing: '0.07em', lineHeight: 1, textAlign: 'center' }}>architects &amp; co</span>
            </span>
          </div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 12, lineHeight: 1.75,
            color: 'rgba(245,240,234,0.28)',
            maxWidth: 220,
          }}>
            {t('footer.tagline', 'Architecture, paysage, patrimoine & design.')}
          </p>
          {socials.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(s => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34,
                    border: '1px solid rgba(245,240,234,0.1)',
                    borderRadius: '50%',
                    color: 'rgba(245,240,234,0.35)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease, border-color 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C8B89A'; e.currentTarget.style.borderColor = 'rgba(200,184,154,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.35)'; e.currentTarget.style.borderColor = 'rgba(245,240,234,0.1)' }}
                >
                  {SOCIAL_ICONS[s.key]}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Colonne 2 — Navigation */}
        <div>
          <span style={colHead}>{headings.nav}</span>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {nav.map(item => (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); window.scrollTo({ top: 0 }) }}
                style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.85)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.4)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Colonne 3 — Disciplines */}
        <div>
          <span style={colHead}>{headings.disc}</span>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {DISCIPLINES.map(d => (
              <button
                key={d.key}
                onClick={() => { navigate(`/discipline/${d.key.toLowerCase()}`); window.scrollTo({ top: 0 }) }}
                style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.85)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.4)' }}
              >
                {d.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Colonne 4 — Contact */}
        <div>
          <span style={colHead}>{headings.contact}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(245,240,234,0.4)', textDecoration: 'none', transition: 'color 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.85)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.4)' }}
            >
              <IconPin />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, lineHeight: 1.6, letterSpacing: '0.03em' }}>{address}</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(245,240,234,0.4)', textDecoration: 'none', transition: 'color 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.85)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,234,0.4)' }}
            >
              <IconPhone />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, lineHeight: 1.6, letterSpacing: '0.03em' }}>{phone}</span>
            </a>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(245,240,234,0.4)' }}>
              <IconClock />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, lineHeight: 1.6, letterSpacing: '0.03em' }}>{hours}</span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Barre de bas ── */}
      <div style={{
        borderTop: '1px solid rgba(245,240,234,0.05)',
        padding: '1.5rem clamp(2rem, 6vw, 7rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(245,240,234,0.18)', letterSpacing: '0.04em' }}>
          {t('footer.copyright', year)}
        </p>
        <button
          onClick={() => { navigate('/careers'); window.scrollTo({ top: 0 }) }}
          style={{
            background: 'none', border: '1px solid rgba(245,240,234,0.1)',
            borderRadius: 40, padding: '7px 20px',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
            fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.3)',
            transition: 'border-color 0.25s, color 0.25s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,240,234,0.3)'; e.currentTarget.style.color = 'rgba(245,240,234,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,234,0.1)'; e.currentTarget.style.color = 'rgba(245,240,234,0.3)' }}
        >
          {t('footer.careers')}
        </button>
      </div>

      <style>{`
        @media (max-width: 860px) {
          footer > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 520px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
