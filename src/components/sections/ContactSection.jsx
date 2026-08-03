import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { insertRow } from '../../lib/supabase'
import ProjectForm, { EMPTY_FORM } from '../ui/ProjectForm'
import { useSiteContent } from '../../context/SiteContentContext'
import { useLanguage } from '../../context/LanguageContext'

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [form, setForm] = useState(EMPTY_FORM)
  const cmsLine1    = useSiteContent('contact.title_line1', 'Parlons de ce')
  const cmsLine2    = useSiteContent('contact.title_line2', 'que vous imaginez')
  const cmsDesc     = useSiteContent('contact.description', 'Chaque projet commence par une conversation. Décrivez-nous votre intention, votre territoire, vos contraintes — nous vous répondons sous 48h.')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorKey, setErrorKey] = useState('')
  const { t, lang } = useLanguage()

  const titleLine1  = lang === 'fr' ? cmsLine1  : t('contact.title_line1')
  const titleLine2  = lang === 'fr' ? cmsLine2  : t('contact.title_line2')
  const description = lang === 'fr' ? cmsDesc   : t('contact.description')

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
        statut: 'interet', source: 'portfolio',
        created_at: new Date().toISOString(),
      })
      if (sbError) throw sbError
      setSent(true)
    } catch (err) {
      console.error('[ContactSection] Supabase error:', err)
      setErrorKey('contact.error_generic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 6vw, 6rem)',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 'clamp(48px, 8vw, 100px)',
        alignItems: 'start',
      }}>

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, letterSpacing: 3,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
          }}>
            {t('contact.supertitle')}
          </span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 400,
            fontSize: 'clamp(36px, 5vw, 58px)', color: '#FAFAF8',
            marginTop: 16, lineHeight: 1.08,
          }}>
            <span
              data-cms-key="contact.title_line1"
              data-cms-type="text"
              data-cms-value={titleLine1}
            >{titleLine1}</span>
            <br />
            <em style={{ color: 'rgba(255,255,255,0.32)' }}>
              <span
                data-cms-key="contact.title_line2"
                data-cms-type="text"
                data-cms-value={titleLine2}
              >{titleLine2}</span>
            </em>
          </h2>

          <div style={{ width: 28, height: 1, background: 'rgba(123,167,212,0.35)', margin: '28px 0' }} />

          <p
            data-cms-key="contact.description"
            data-cms-type="multiline"
            data-cms-value={description}
            style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.85,
              color: 'rgba(255,255,255,0.38)', maxWidth: 320,
            }}
          >
            {description}
          </p>

        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {sent ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: '50%',
                border: '1px solid rgba(141,190,138,0.25)',
                marginBottom: 32,
              }}>
                <span style={{ fontSize: 22, color: 'rgba(141,190,138,0.7)' }}>✦</span>
              </div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 34,
                fontWeight: 400, color: '#FAFAF8', marginBottom: 16,
              }}>
                {t('contact.success_title')}
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75 }}>
                {t('contact.success_body').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
              </p>
            </div>
          ) : (
            <ProjectForm
              form={form} setForm={setForm}
              onSubmit={submit} loading={loading} error={errorKey ? t(errorKey) : ''}
            />
          )}
        </motion.div>

      </div>
    </section>
  )
}
