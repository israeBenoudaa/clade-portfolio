import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

const SERVICES = ['Architecture', 'Conservation', 'Paysage', 'Design', 'Éphémère']
const BUDGETS = ['< 500K MAD', '500K – 2M MAD', '2M – 5M MAD', '> 5M MAD', 'À définir']

export const EMPTY_FORM = {
  nom: '', prenom: '', email: '', telephone: '',
  societe: '', service: '', budget: '', surface: '', localisation: '', description: '',
}

const LBL = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5,
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', display: 'block', marginBottom: 8,
}

const GLASS_BTN = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  padding: '13px 16px',
  fontFamily: 'Instrument Serif, serif',
  fontSize: 16,
  color: '#FAFAF8',
  width: '100%',
  outline: 'none',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
  transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
  textAlign: 'left',
  cursor: 'pointer',
}

function ServiceDropdown({ value, onChange, compact }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { t } = useLanguage()
  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...GLASS_BTN,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: value ? '#FAFAF8' : 'rgba(255,255,255,0.2)',
          borderColor: open ? 'rgba(123,167,212,0.32)' : 'rgba(255,255,255,0.09)',
          background: open ? 'rgba(123,167,212,0.04)' : 'rgba(255,255,255,0.04)',
          boxShadow: open
            ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 3px rgba(123,167,212,0.07)'
            : 'inset 0 1px 0 rgba(255,255,255,0.06)',
          padding: compact ? '11px 14px' : '13px 16px',
          fontSize: compact ? 13 : 14,
        }}
      >
        <span>{value ? (t('form.service.' + value) || value) : t('form.select')}</span>
        <span style={{
          transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.25s',
          color: open ? 'rgba(123,167,212,0.6)' : 'rgba(255,255,255,0.2)', fontSize: 10,
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300,
          background: 'rgba(8,13,28,0.96)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}>
          {['', ...SERVICES].map((s, i) => (
            <div
              key={s || '__empty'}
              onClick={() => { onChange(s); setOpen(false) }}
              onMouseEnter={e => { if (value !== s || !s) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.background = value === s && s ? 'rgba(123,167,212,0.08)' : 'transparent' }}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                fontFamily: 'Instrument Serif, serif', fontSize: 15,
                color: !s ? 'rgba(255,255,255,0.2)' : value === s ? '#7BA7D4' : 'rgba(255,255,255,0.8)',
                background: value === s && s ? 'rgba(123,167,212,0.08)' : 'transparent',
                borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition: 'background 0.15s',
              }}
            >
              {s ? (t('form.service.' + s) || s) : t('form.select')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectForm({ form, setForm, onSubmit, loading, error, compact }) {
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const { t } = useLanguage()
  const gap = compact ? 14 : 24
  const lbl = compact
    ? { ...LBL, fontSize: 8, letterSpacing: 2, marginBottom: 6 }
    : LBL
  const giClass = compact ? 'gi gi-sm' : 'gi'

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px 12px` }}>
        <div>
          <span style={lbl}>{t('form.name')}</span>
          <input className={giClass} value={form.nom} onChange={set('nom')} placeholder="—" required />
        </div>
        <div>
          <span style={lbl}>{t('form.firstname')}</span>
          <input className={giClass} value={form.prenom} onChange={set('prenom')} placeholder="—" />
        </div>
      </div>

      <div>
        <span style={lbl}>{t('form.email')}</span>
        <input className={giClass} type="email" value={form.email} onChange={set('email')} placeholder="—" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px 12px` }}>
        <div>
          <span style={lbl}>{t('form.phone')}</span>
          <input className={giClass} value={form.telephone} onChange={set('telephone')} placeholder="—" />
        </div>
        <div>
          <span style={lbl}>{t('form.client')}</span>
          <input className={giClass} value={form.societe} onChange={set('societe')} placeholder="—" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px 12px` }}>
        <div>
          <span style={lbl}>{t('form.location')}</span>
          <input className={giClass} value={form.localisation} onChange={set('localisation')} placeholder="—" />
        </div>
        <div>
          <span style={lbl}>{t('form.area')}</span>
          <input className={giClass} type="number" min="0" value={form.surface} onChange={set('surface')} placeholder="—" />
        </div>
      </div>

      <div>
        <span style={lbl}>{t('form.type')}</span>
        <ServiceDropdown value={form.service} onChange={v => setForm(f => ({ ...f, service: v }))} compact={compact} />
      </div>

      <div>
        <span style={lbl}>{t('form.budget')}</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {BUDGETS.map(b => (
            <button
              key={b} type="button"
              onClick={() => setForm(f => ({ ...f, budget: b }))}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: compact ? 8 : 9, letterSpacing: 1.5,
                padding: compact ? '5px 11px' : '7px 14px',
                borderRadius: 20, border: '1px solid',
                borderColor: form.budget === b ? 'rgba(123,167,212,0.45)' : 'rgba(255,255,255,0.22)',
                background: form.budget === b ? 'rgba(123,167,212,0.08)' : 'rgba(255,255,255,0.06)',
                color: form.budget === b ? '#7BA7D4' : 'rgba(255,255,255,0.62)',
                boxShadow: form.budget === b ? '0 0 0 2px rgba(123,167,212,0.08)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}
            >{t('form.budget.' + b) || b}</button>
          ))}
        </div>
      </div>

      <div>
        <span style={lbl}>{t('form.description')}</span>
        <textarea
          className={giClass}
          style={{ resize: 'vertical', minHeight: compact ? 70 : 100, lineHeight: 1.7 }}
          rows={compact ? 3 : 4}
          value={form.description} onChange={set('description')}
          placeholder="…"
          required
        />
      </div>

      {error && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#C8A47B' }}>
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 8px 36px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.18)' }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: '#F5F0EA',
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: 50,
          padding: compact ? '14px 28px' : '16px 40px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 10, fontWeight: 600, letterSpacing: 2.8, textTransform: 'uppercase',
          opacity: loading ? 0.5 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 24px rgba(0,0,0,0.2)',
          transition: 'opacity 0.2s',
          width: compact ? '100%' : 'auto',
          alignSelf: 'center',
          marginTop: 8,
        }}
      >
        {loading ? t('form.sending') : t('form.submit')}
      </motion.button>

    </form>
  )
}
