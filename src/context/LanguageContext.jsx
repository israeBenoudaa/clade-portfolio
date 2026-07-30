import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext({ lang: 'fr', setLang: () => {}, t: k => k })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('clade_lang') || 'fr'
  )

  const setLang = (l) => {
    const lower = l.toLowerCase()
    setLangState(lower)
    localStorage.setItem('clade_lang', lower)
  }

  const t = useCallback((key, ...args) => {
    const val = translations[lang]?.[key] ?? translations.fr[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
