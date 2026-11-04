import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCmsEditMode } from './CmsEditMode'
import { useLanguage } from './LanguageContext'

const Ctx = createContext({})
const CACHE_KEY = 'clade_site_content_v1'

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(readCache)

  useEffect(() => {
    if (!supabase) return

    // Chargement initial
    supabase.from('site_content').select('key, value')
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(r => [r.key, r.value]))
          setContent(map)
          writeCache(map)
        }
      })

    // Écoute des changements en temps réel
    const channel = supabase
      .channel('site_content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
        setContent(prev => {
          const next = { ...prev }
          if (payload.eventType === 'DELETE') {
            delete next[payload.old.key]
          } else {
            next[payload.new.key] = payload.new.value
          }
          writeCache(next)
          return next
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export function useSiteContent(key, defaultValue = '') {
  const siteContent = useContext(Ctx)
  const { overrides } = useCmsEditMode()
  const { lang } = useLanguage()
  const langKey = `${lang}.${key}`
  // Priority: live override (lang) > live override (base) > DB (lang) > DB (base) > default
  return overrides[langKey] ?? overrides[key] ?? siteContent[langKey] ?? siteContent[key] ?? defaultValue
}

export function useSiteContentJson(key, defaultValue = []) {
  const raw = useSiteContent(key, null)
  if (raw === null) return defaultValue
  try { return JSON.parse(raw) } catch { return defaultValue }
}
