import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '3rem 2rem',
      display: 'flex', flexDirection: 'column', gap: 24,
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: "'Averia Libre', serif", fontSize: 22, fontWeight: 400, letterSpacing: 2, color: '#F5F0EA' }}>Clade</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,234,0.3)', textTransform: 'uppercase' }}>architects & co</span>
      </div>
      <button
        onClick={() => { navigate('/careers'); window.scrollTo({ top: 0 }) }}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 40, padding: '9px 28px',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
          fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          transition: 'border-color 0.2s, color 0.2s, background 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#FAFAF8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none' }}
      >
        {t('footer.careers')}
      </button>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
        {t('footer.copyright', year)}
      </p>
    </footer>
  )
}
