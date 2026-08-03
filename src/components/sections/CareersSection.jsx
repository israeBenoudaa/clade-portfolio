import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { insertRow, supabase } from '../../lib/supabase'
import { useLanguage } from '../../context/LanguageContext'

const tag = (txt) => ({
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4, padding: '3px 8px',
  display: 'inline-block',
})

function DeptSelect({ value, onChange, depts, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: open ? 'rgba(184,154,200,0.06)' : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${open ? 'rgba(184,154,200,0.35)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 10, padding: '11px 40px 11px 14px',
          fontFamily: 'DM Sans, sans-serif', fontSize: 13,
          color: value ? '#FAFAF8' : 'rgba(255,255,255,0.25)',
          transition: 'border-color 0.2s, background 0.2s',
          position: 'relative',
        }}
      >
        {value || placeholder || '—'}
        <span style={{
          position: 'absolute', right: 13, top: '50%',
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
          color: open ? 'rgba(184,154,200,0.7)' : 'rgba(255,255,255,0.25)',
          fontSize: 11, lineHeight: 1,
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
          background: 'rgba(8,9,10,0.96)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div
            onClick={() => { onChange(''); setOpen(false) }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            style={{
              padding: '10px 14px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              transition: 'background 0.15s',
            }}
          >{placeholder || '—'}</div>
          {depts.map(d => (
            <div
              key={d}
              onClick={() => { onChange(d); setOpen(false) }}
              onMouseEnter={e => { if (value !== d) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (value !== d) e.currentTarget.style.background = value === d ? 'rgba(184,154,200,0.1)' : 'transparent' }}
              style={{
                padding: '11px 14px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                color: value === d ? '#C4A8D8' : 'rgba(255,255,255,0.8)',
                background: value === d ? 'rgba(184,154,200,0.1)' : 'transparent',
                transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', gap: 9,
              }}
            >
              {value === d && (
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B89AC8', flexShrink: 0, boxShadow: '0 0 6px rgba(184,154,200,0.5)' }} />
              )}
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CareersSection({ hideHeader = false, autoTrigger = false }) {
  const ref = useRef(null)
  const inViewNative = useInView(ref, { once: true, margin: '-10%' })
  const inView = autoTrigger || inViewNative

  const [offres, setOffres] = useState([])
  const [selectedOffre, setSelectedOffre] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', posteSouhaite: '', departement: '', cvUrl: '', portfolioUrl: '', message: '' })
  const [depts, setDepts] = useState([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('departements').select('nom').order('nom')
      .then(({ data }) => { if (data) setDepts(data.map(d => d.nom)) })
  }, [])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorKey, setErrorKey] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('recrutements')
      .select('id, intitule, dept, type_contrat, description, missions')
      .eq('statut', 'ouvert')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setOffres(data) })
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleApply = (offre) => {
    setSelectedOffre(offre)
    setForm({ prenom: '', nom: '', email: '', telephone: '', posteSouhaite: offre.intitule || '', departement: offre.dept || '', cvUrl: '', portfolioUrl: '', message: '' })
    setSent(false)
    setTimeout(() => {
      document.getElementById('candidature-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const submit = async (e) => {
    e.preventDefault()
    const missingPoste = !selectedOffre && !form.posteSouhaite.trim()
    if (!form.nom || !form.email || !form.message || missingPoste) { setErrorKey('careers.error_required'); return }
    setLoading(true); setErrorKey('')
    try {
      const payload = {
        id: `cs${Date.now()}`,
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || null,
        poste_vise: selectedOffre ? selectedOffre.intitule : form.posteSouhaite,
        message: form.message,
        statut: 'nouveau',
        date_reception: new Date().toISOString().slice(0, 10),
      }
      if (form.cvUrl) payload.cv_url = form.cvUrl
      if (selectedOffre?.id) payload.offre_id = selectedOffre.id
      if (form.departement) payload.departement = form.departement
      if (form.portfolioUrl) payload.portfolio_url = form.portfolioUrl

      const { error: sbError } = await insertRow('candidatures_spont', payload)
      if (sbError) throw sbError
      setSent(true)
    } catch (err) {
      console.error('[CareersSection] Supabase error:', err)
      setErrorKey('careers.error_generic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="agence" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 6vw, 6rem)',
      background: '#08090A',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Header ── */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '4rem', maxWidth: 600 }}
          >
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              {t('careers.supertitle')}
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 400, color: '#FAFAF8', marginTop: 12, lineHeight: 1.15 }}>
              {t('careers.h2')}
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
              {t('careers.intro')}
            </p>
          </motion.div>
        )}

        {/* ── Postes ouverts ── */}
        {offres.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: '5rem' }}
          >
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
              {t('careers.positions', offres.length)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 16 }}>
              {offres.map((offre, i) => (
                <motion.div
                  key={offre.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                  className="glass"
                  style={{
                    borderRadius: 16,
                    padding: '24px 26px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    border: selectedOffre?.id === offre.id ? '1px solid rgba(123,167,212,0.4)' : undefined,
                    background: selectedOffre?.id === offre.id ? 'rgba(123,167,212,0.06)' : undefined,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {/* Tags + titre + toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {offre.dept && <span style={tag()}>{offre.dept}</span>}
                        {offre.type_contrat && <span style={tag()}>{offre.type_contrat}</span>}
                      </div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 500, color: '#FAFAF8', lineHeight: 1.2 }}>
                        {offre.intitule}
                      </div>
                    </div>

                    {(offre.description || offre.missions) && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(id => id === offre.id ? null : offre.id)}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                          fontFamily: 'Space Grotesk, sans-serif', fontSize: 8,
                          letterSpacing: 2, textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.68)', transition: 'color 0.2s',
                          marginTop: 3,
                        }}
                      >
                        <span style={{
                          display: 'inline-block', fontSize: 8,
                          transform: `rotate(${expandedId === offre.id ? 180 : 0}deg)`,
                          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                        }}>▾</span>
                        {expandedId === offre.id ? t('careers.hide') : t('careers.detail')}
                      </button>
                    )}
                  </div>

                  {/* Détail dépliable */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: expandedId === offre.id ? 400 : 0,
                    opacity: expandedId === offre.id ? 1 : 0,
                    transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
                  }}>
                    <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {offre.description && (
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                          {offre.description}
                        </p>
                      )}
                      {offre.missions && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                          {offre.missions.split('\n').filter(Boolean).map((m, mi) => (
                            <div key={mi} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                              <span style={{ color: 'rgba(184,154,200,0.45)', flexShrink: 0, marginTop: 1 }}>–</span>
                              <span>{m.replace(/^[-•·]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Postuler */}
                  <button
                    onClick={() => handleApply(offre)}
                    style={{
                      marginTop: 4, alignSelf: 'flex-start',
                      background: selectedOffre?.id === offre.id ? '#FAFAF8' : 'transparent',
                      color: selectedOffre?.id === offre.id ? '#060B18' : '#FAFAF8',
                      border: '1px solid',
                      borderColor: selectedOffre?.id === offre.id ? '#FAFAF8' : 'rgba(255,255,255,0.25)',
                      borderRadius: 40, padding: '10px 22px',
                      fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {selectedOffre?.id === offre.id ? t('careers.selected') : t('careers.apply')}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Formulaire candidature ── */}
        <div id="candidature-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 48 }}>

          {/* Left — valeurs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, color: '#FAFAF8', lineHeight: 1.2 }}>
                {selectedOffre ? (
                  <>{t('careers.apply_for')}<br /><em style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedOffre.intitule}</em></>
                ) : (
                  <>{t('careers.application')}<br /><em style={{ color: 'rgba(255,255,255,0.4)' }}>{t('careers.unsolicited')}</em></>
                )}
              </div>
              {selectedOffre && (
                <button
                  onClick={() => setSelectedOffre(null)}
                  style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {t('careers.unsolicited_link')}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
              {[
                { icon: '◎', title: t('careers.v1_title'), desc: t('careers.v1_desc') },
                { icon: '◈', title: t('careers.v2_title'), desc: t('careers.v2_desc') },
                { icon: '◇', title: t('careers.v3_title'), desc: t('careers.v3_desc') },
              ].map(v => (
                <div key={v.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'rgba(200,184,154,0.45)', flexShrink: 0, lineHeight: 1.3 }}>{v.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#FAFAF8', marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.33)' }}>{v.desc}</div>
                  </div>
                </div>
              ))}

              {/* & more */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
                <div style={{ width: 1, height: 20, background: 'rgba(200,184,154,0.18)', flexShrink: 0, marginLeft: 8 }} />
                <span style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  fontStyle: 'italic',
                  color: 'rgba(200,184,154,0.35)',
                  letterSpacing: '0.01em',
                }}>
                  {t('projects.more')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {sent ? (
              <div style={{ padding: '48px 32px', textAlign: 'center', background: 'rgba(184,154,200,0.06)', border: '1px solid rgba(184,154,200,0.2)', borderRadius: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 400, color: '#FAFAF8', marginBottom: 10 }}>{t('careers.success_title')}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  {t('careers.success_body')}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.firstname')}</label>
                    <input className="gi gi-sm" value={form.prenom} onChange={set('prenom')} placeholder="—" required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.name')}</label>
                    <input className="gi gi-sm" value={form.nom} onChange={set('nom')} placeholder="—" required />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.email')}</label>
                  <input className="gi gi-sm" type="email" value={form.email} onChange={set('email')} placeholder="—" required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.phone')}</label>
                  <input className="gi gi-sm" value={form.telephone} onChange={set('telephone')} placeholder="—" />
                </div>

                {selectedOffre ? (
                  <div style={{ padding: '10px 14px', background: 'rgba(184,154,200,0.06)', border: '1px solid rgba(184,154,200,0.2)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{t('careers.app_for')}</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#FAFAF8', fontWeight: 500 }}>
                      {selectedOffre.intitule}{selectedOffre.dept && <span style={{ color: 'rgba(255,255,255,0.4)' }}> · {selectedOffre.dept}</span>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.position')}</label>
                      <input className="gi gi-sm" value={form.posteSouhaite} onChange={set('posteSouhaite')} placeholder="—" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.dept')}</label>
                      <DeptSelect value={form.departement} onChange={v => setForm(f => ({ ...f, departement: v }))} depts={depts} placeholder={t('form.select')} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.cv')}</label>
                    <input className="gi gi-sm" type="url" value={form.cvUrl} onChange={set('cvUrl')} placeholder="https://..." />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>{t('careers.portfolio_link')}</label>
                    <input className="gi gi-sm" type="url" value={form.portfolioUrl} onChange={set('portfolioUrl')} placeholder="https://..." />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>
                    {t('careers.cover')}
                  </label>
                  <textarea className="gi gi-sm" rows={5} value={form.message} onChange={set('message')}
                    placeholder="…"
                    required style={{ resize: 'vertical', minHeight: 120 }} />
                </div>

                {errorKey && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#C8A47B' }}>{t(errorKey)}</p>}

                <button type="submit" disabled={loading} style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#F5F0EA',
                  border: '1px solid rgba(255,255,255,0.28)',
                  borderRadius: 50,
                  padding: '14px 36px', marginTop: 8,
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 600,
                  letterSpacing: 2.8, textTransform: 'uppercase',
                  opacity: loading ? 0.5 : 1, alignSelf: 'center', cursor: loading ? 'not-allowed' : 'pointer',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 24px rgba(0,0,0,0.2)',
                  transition: 'opacity 0.2s, background 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 32px rgba(255,255,255,0.1)' }}}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 24px rgba(0,0,0,0.2)' }}
                >
                  {loading ? t('careers.sending') : selectedOffre ? t('careers.submit_offer') : t('careers.submit_spontaneous')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
