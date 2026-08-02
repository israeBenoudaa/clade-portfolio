import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteContent } from '../../context/SiteContentContext'
import { useCmsEditMode } from '../../context/CmsEditMode'
import { useLanguage } from '../../context/LanguageContext'

const DISCIPLINES = [
  {
    key: 'C', label: 'Conservation',
    desc: 'Préserver et valoriser le patrimoine bâti et naturel',
    image: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1200&q=80&auto=format&fit=crop',
    color: '#7BA7D4',
  },
  {
    key: 'L', label: 'Landscape',
    desc: 'Concevoir les espaces extérieurs comme des œuvres vivantes',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&q=80&auto=format&fit=crop',
    color: '#8DBE8A',
  },
  {
    key: 'A', label: 'Architecture',
    desc: "Créer des espaces qui habitent le territoire avec justesse",
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80&auto=format&fit=crop',
    color: '#C8B89A',
  },
  {
    key: 'D', label: 'Design',
    desc: 'Donner forme aux identités et aux objets du quotidien',
    image: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=1200&q=80&auto=format&fit=crop',
    color: '#B89AC8',
  },
  {
    key: 'E', label: 'Éphémère',
    desc: "Installer, marquer, disparaître — l'architecture du moment",
    image: 'https://images.unsplash.com/photo-1519619091416-f5d55b8d0e39?w=1200&q=80&auto=format&fit=crop',
    color: '#C8A47B',
  },
]

/* ── Panel extracted as component so it can call hooks ── */
function DisciplinePanel({ d, active, onToggle, onPrev, onNext, canPrev, canNext }) {
  const navigate    = useNavigate()
  const image       = useSiteContent(`discipline.${d.key}.hero_image`, d.image)
  const { editMode } = useCmsEditMode()
  const { t }       = useLanguage()
  const isActive    = active === d.key
  const isIdle      = active !== null && !isActive

  const handlePanelClick = () => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      onToggle(isActive ? null : d.key)
    }
  }

  const handleCta = (e) => {
    e.stopPropagation()
    navigate(`/discipline/${d.key.toLowerCase()}`)
  }

  return (
    <div
      onMouseEnter={() => {
        if (window.matchMedia('(pointer: fine)').matches) onToggle(d.key)
      }}
      onClick={handlePanelClick}
      style={{
        position: 'relative', overflow: 'hidden', minWidth: 0,
        flex: isActive ? 5 : isIdle ? 0.28 : 1,
        transition: 'flex 0.75s cubic-bezier(0.77,0,0.175,1)',
        cursor: 'pointer',
      }}
    >
      {/* Background image — synchronized via useSiteContent */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${image}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: isActive
          ? 'brightness(0.85) saturate(0.88)'
          : 'brightness(0.58) saturate(0.68)',
        transition: 'filter 0.7s, transform 0.9s',
        transform: isActive ? 'scale(1.06)' : 'scale(1)',
      }} />

      {/* Overlay — pointer-events:none so clicks reach the background div */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isActive
          ? 'linear-gradient(135deg, rgba(8,9,10,0.2) 0%, rgba(8,9,10,0.05) 100%)'
          : 'rgba(8,9,10,0.45)',
        transition: 'background 0.5s',
        pointerEvents: 'none',
      }} />

      {/* Admin-only edit button — visible only in CMS edit mode */}
      {editMode && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }}>
          <button
            data-cms-key={`discipline.${d.key}.hero_image`}
            data-cms-type="image"
            data-cms-value={image}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 9px',
              background: 'rgba(200,184,154,0.92)', backdropFilter: 'blur(8px)',
              border: 'none', borderRadius: 6,
              color: '#08090A', fontSize: 9, letterSpacing: 1.5,
              textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, cursor: 'pointer',
            }}
          >
            ✎
          </button>
        </div>
      )}

      {/* Inactive state */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: isActive ? 0 : 1, transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}>
        {!isIdle && (
          <span style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 400,
            color: 'rgba(245,240,234,0.65)', userSelect: 'none', lineHeight: 1,
          }}>
            {d.key}
          </span>
        )}
        {isIdle && (
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.28)',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          }}>
            {d.label}
          </span>
        )}
      </div>

      {/* Active state */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 'clamp(1.5rem, 4vw, 3rem)',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.45s 0.15s, transform 0.45s 0.15s',
        pointerEvents: isActive ? 'auto' : 'none',
      }}>
        <h3 style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(28px, 5vw, 72px)', fontWeight: 400,
          color: '#F5F0EA', lineHeight: 1, letterSpacing: '-0.02em',
          margin: '0 0 16px',
        }}>
          {t('disc.' + d.key + '.label')}
        </h3>
        <div style={{ width: 32, height: 1, background: d.color, marginBottom: 18 }} />
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(11px, 1.2vw, 13px)', lineHeight: 1.85,
          color: 'rgba(245,240,234,0.85)', maxWidth: 220,
          textShadow: '0 1px 12px rgba(0,0,0,0.8)',
        }}>
          {t('disc.' + d.key + '.desc')}
        </p>
        <button
          onClick={handleCta}
          style={{
            marginTop: 24, padding: '11px 24px', borderRadius: 30,
            border: '1px solid rgba(245,240,234,0.55)',
            background: 'rgba(245,240,234,0.12)',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.22)'; e.currentTarget.style.borderColor = 'rgba(245,240,234,0.85)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,234,0.12)'; e.currentTarget.style.borderColor = 'rgba(245,240,234,0.55)' }}
        >
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
            color: 'rgba(245,240,234,0.9)',
          }}>
            {t('disciplines.cta')}
          </span>
        </button>
      </div>

      {/* Flèches prev/next — en bas du panel actif */}
      {isActive && (
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 12,
          zIndex: 10,
        }}>
          {[
            { disabled: !canPrev, onClick: (e) => { e.stopPropagation(); onPrev() }, label: '←' },
            { disabled: !canNext, onClick: (e) => { e.stopPropagation(); onNext() }, label: '→' },
          ].map(({ disabled, onClick, label }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={disabled}
              style={{
                background: 'none', border: 'none', padding: '8px 14px',
                color: disabled ? 'rgba(245,240,234,0.15)' : 'rgba(245,240,234,0.7)',
                cursor: disabled ? 'default' : 'pointer',
                fontSize: 20, letterSpacing: 1,
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = 'rgba(245,240,234,1)' }}
              onMouseLeave={e => { e.currentTarget.style.color = disabled ? 'rgba(245,240,234,0.15)' : 'rgba(245,240,234,0.7)' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DisciplinesSection() {
  const [active, setActive] = useState(null)
  const { t } = useLanguage()

  const activeIdx = DISCIPLINES.findIndex(d => d.key === active)
  const canPrev   = activeIdx > 0
  const canNext   = activeIdx !== -1 && activeIdx < DISCIPLINES.length - 1

  return (
    <section id="approche" style={{ background: '#08090A' }}>

      {/* Header */}
      <div style={{
        padding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 6vw, 7rem) 2.5rem',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
          letterSpacing: 3.5, textTransform: 'uppercase',
          color: 'rgba(245,240,234,0.3)',
        }}>
          {t('disciplines.supertitle')}
        </span>
        <h2 style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(28px, 4vw, 50px)',
          fontWeight: 400, color: '#F5F0EA',
          marginTop: 10, lineHeight: 1,
        }}>
          {t('disciplines.h2')}
        </h2>
      </div>

      {/* Panels */}
      <div
        style={{ display: 'flex', height: 'clamp(380px, 60vh, 750px)', gap: 2, padding: '0 2px 2px' }}
        onMouseLeave={() => { if (window.matchMedia('(pointer: fine)').matches) setActive(null) }}
      >
        {DISCIPLINES.map(d => (
          <DisciplinePanel
            key={d.key} d={d} active={active} onToggle={setActive}
            canPrev={canPrev} canNext={canNext}
            onPrev={() => setActive(DISCIPLINES[activeIdx - 1].key)}
            onNext={() => setActive(DISCIPLINES[activeIdx + 1].key)}
          />
        ))}
      </div>
    </section>
  )
}
