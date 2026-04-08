import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="appearance-none bg-white/60 hover:bg-white/80 border border-white/50 rounded-xl pl-3 pr-8 py-1.5 text-sm font-semibold text-gray-800 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur"
        aria-label="Language selector"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      {/* Dropdown chevron */}
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
