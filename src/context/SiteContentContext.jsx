import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCmsEditMode } from './CmsEditMode'
import { useLanguage } from './LanguageContext'

const Ctx = createContext({})

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({})

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_content').select('key, value')
      .then(({ data }) => {
        if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value])))
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
