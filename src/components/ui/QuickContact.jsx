import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { insertRow } from '../../lib/supabase'
import ProjectForm, { EMPTY_FORM } from './ProjectForm'
import { useLanguage } from '../../context/LanguageContext'

export default function QuickContact({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorKey, setErrorKey] = useState('')
  const { t } = useLanguage()

  const submit = async (e) => {
    e.preventDefault()
    if (!form.budget) { setErrorKey('contact.error_budget'); return }
    setLoading(true); setErrorKey('')
    try {
      const { error: sbError } = await insertRow('prospects', {
        id: `pro${Date.now()}`,
        nom: form.nom, prenom: form.prenom,
        email: form.email, telephone: form.telephone,
        type_projet: form.service, budget: form.budget,
        localisation: form.localisation || null,
        surface: parseFloat(form.surface) || null,
        notes: [form.societe && `Maître d'ouvrage : ${form.societe}`, form.description].filter(Boolean).join('\n\n') || null,
        statut: 'interet', source: 'quick-contact',
        created_at: new Date().toISOString(),
      })
      if (sbError) throw sbError
      setSent(true)
    } catch (err) {
      console.error('[QuickContact] Supabase error:', err)
      setErrorKey('contact.error_generic')
    } finally {
      setLoading(false)
    }
  }

  const close = () => {
    onClose()
    setTimeout(() => { setSent(false); setError(''); setForm(EMPTY_FORM) }, 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(6,11,24,0.78)',
              backdropFilter: 'blur(10px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 56 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              zIndex: 2100,
              width: 'min(480px, 100vw)',
              background: [
                'radial-gradient(ellipse 160% 55% at 120% -8%, rgba(74,127,193,0.14) 0%, transparent 52%)',
                'radial-gradient(ellipse 80% 40% at -10% 110%, rgba(123,167,212,0.07) 0%, transparent 50%)',
                'radial-gradient(ellipse 60% 30% at 110% 100%, rgba(200,184,154,0.05) 0%, transparent 45%)',
                '#09101E',
              ].join(', '),
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 20, pointerEvents: 'none',
              background: 'linear-gradient(90deg, transparent 0%, rgba(123,167,212,0.5) 35%, rgba(200,184,154,0.25) 65%, transparent 100%)',
            }} />

            {/* Sticky header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              background: 'rgba(9,16,30,0.92)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              padding: '28px 32px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ paddingTop: 4 }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 9,
                    letterSpacing: 3.5, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)', marginBottom: 10,
                  }}>
                    {t('qcontact.supertitle')}
                  </div>
                  <h2 style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 400,
                    color: '#FAFAF8', lineHeight: 1.05, letterSpacing: '-0.02em',
                    margin: 0,
                  }}>
                    {t('qcontact.h2_1')}<br />
                    <em style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{t('qcontact.h2_2')}</em>
                  </h2>
                </div>
                <button
                  onClick={close}
                  onMouseEnter={e => e.currentTarget.style.color = '#FAFAF8'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                  style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.25)', fontSize: 16,
                    lineHeight: 1, padding: '4px 6px', cursor: 'pointer',
                    transition: 'color 0.2s', marginTop: 2, flexShrink: 0,
                  }}
                >✕</button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 36px', flex: 1 }}>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', textAlign: 'center',
                    gap: 20, paddingTop: 60,
                  }}
                >
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 64, height: 64, borderRadius: '50%',
                    border: '1px solid rgba(141,190,138,0.25)',
                  }}>
                    <span style={{ fontSize: 22, color: 'rgba(141,190,138,0.7)' }}>✦</span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: 30,
                    fontWeight: 400, color: '#FAFAF8', lineHeight: 1.2,
                  }}>
                    {t('qcontact.success_title')}
                  </h3>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                    color: 'rgba(255,255,255,0.38)', lineHeight: 1.75,
                  }}>
                    {t('qcontact.success_body').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
                  </p>
                  <button
                    onClick={close}
                    style={{
                      marginTop: 16, background: 'none',
                      border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40,
                      padding: '12px 28px', color: 'rgba(255,255,255,0.55)',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                      letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >{t('qcontact.close')}</button>
                </motion.div>
              ) : (
                <ProjectForm
                  form={form} setForm={setForm}
                  onSubmit={submit} loading={loading} error={errorKey ? t(errorKey) : ''}
                  compact
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
