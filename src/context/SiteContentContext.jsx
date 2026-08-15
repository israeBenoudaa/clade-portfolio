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
  // Initialise depuis le cache localStorage → zéro flash
  const [content, setContent] = useState(readCache)

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_content').select('key, value')
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(r => [r.key, r.value]))
          setContent(map)
          writeCache(map)
        }
      })
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
