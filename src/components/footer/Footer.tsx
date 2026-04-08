import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-transparent px-4 py-3">
      <div className="flex items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
        <a
          href="https://www.linkedin.com/in/mahfouzer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors font-semibold"
          aria-label={t('footer.linkedin')}
        >
          {t('footer.linkedin')}
        </a>
        <a
          href="https://www.buymeacoffee.com/mahfouzer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors font-semibold"
          aria-label={t('footer.buyCoffee')}
        >
          {t('footer.buyCoffee')}
        </a>
      </div>
    </footer>
  )
}

