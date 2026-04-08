import { useTranslation } from 'react-i18next'
import { ProgressBar } from '@/components/ui/ProgressBar'
import currenciesData from '@/data/currencies.json'

const currencies = currenciesData as Record<string, { symbol: string; name: string }>

interface NetWorthInputProps {
  netWorth: string
  setNetWorth: (value: string) => void
  currency: string
  setCurrency: (value: string) => void
  loading: boolean
  error: string | null
  isStale: boolean
  onCalculate?: () => void
  variant?: 'default' | 'dock'
}

export function NetWorthInput({
  netWorth,
  setNetWorth,
  currency,
  setCurrency,
  loading,
  error,
  isStale,
  onCalculate,
  variant = 'default',
}: NetWorthInputProps) {
  const { t } = useTranslation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow numbers, decimal point, and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNetWorth(value)
    }
  }

  const isDock = variant === 'dock'

  return (
    <div className="w-full">
      <div className={`flex flex-col ${isDock ? 'gap-2' : 'gap-2 sm:gap-4'}`}>
        {/* Title - hidden on mobile since header has the info */}
        <div className={`${isDock ? 'hidden' : 'hidden lg:block'} flex-shrink-0 min-w-0`}>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t('title')}</h2>
          <p className="text-sm text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Form row */}
        {isDock ? (
          <>
            {/* ── MOBILE: clean stacked card (hidden on sm+) ── */}
            <div className="sm:hidden flex flex-col gap-2">
              {/* Net worth input */}
              <div className="h-12 rounded-2xl bg-white/80 border border-gray-200/70 shadow-sm flex items-center px-4 gap-3">
                <span className="text-gray-500 font-semibold text-base flex-shrink-0">
                  {currencies[currency]?.symbol || currency}
                </span>
                <div className="w-px h-5 bg-gray-200 flex-shrink-0" aria-hidden="true" />
                <label htmlFor="net-worth-mobile" className="sr-only">{t('input.label')}</label>
                <input
                  id="net-worth-mobile"
                  type="text"
                  inputMode="decimal"
                  value={netWorth}
                  onChange={handleInputChange}
                  placeholder={t('input.label')}
                  className="flex-1 bg-transparent outline-none border-none text-sm font-semibold text-gray-900 placeholder:text-gray-400"
                  aria-required="true"
                  autoComplete="off"
                />
              </div>

              {/* Currency selector */}
              <div className="h-12 rounded-2xl bg-white/80 border border-gray-200/70 shadow-sm relative flex items-center">
                <label htmlFor="currency-mobile" className="sr-only">{t('input.currency')}</label>
                <select
                  id="currency-mobile"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-full appearance-none bg-transparent outline-none border-none text-sm font-semibold text-gray-800 px-4 pe-10"
                  aria-label={t('input.currency')}
                >
                  {Object.entries(currencies).map(([code, info]) => (
                    <option key={code} value={code}>{code} - {info.name}</option>
                  ))}
                </select>
                <svg className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Calculate button */}
              {onCalculate && (
                <button
                  type="button"
                  onClick={onCalculate}
                  disabled={loading || !netWorth || isNaN(parseFloat(netWorth))}
                  className="h-12 w-full rounded-2xl text-sm font-bold text-white shadow-[0_14px_40px_rgba(16,185,129,0.35)] disabled:shadow-none disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/70 border-t-white animate-spin" aria-hidden="true" />
                      {t('input.calculating')}
                    </>
                  ) : t('input.calculate')}
                </button>
              )}
            </div>

            {/* ── DESKTOP: single pill row (hidden on mobile) ── */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Left icon */}
              <div className="h-11 w-11 flex-shrink-0 rounded-full bg-emerald-50 border border-emerald-200/70 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10V6m0 12v-2m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Net worth segment */}
              <div className="flex-1 min-w-0 h-11 rounded-full bg-white/80 border border-gray-200/70 shadow-sm flex items-center px-4 gap-2">
                <span className="text-gray-500 font-semibold text-sm flex-shrink-0">
                  {currencies[currency]?.symbol || currency}
                </span>
                <label htmlFor="net-worth" className="sr-only">{t('input.label')}</label>
                <input
                  id="net-worth"
                  type="text"
                  inputMode="decimal"
                  value={netWorth}
                  onChange={handleInputChange}
                  placeholder={t('input.label')}
                  className="w-full bg-transparent outline-none border-none text-sm font-semibold text-gray-900 placeholder:text-gray-400"
                  aria-describedby={error ? 'error-message' : undefined}
                  aria-required="true"
                  autoComplete="off"
                />
              </div>

              {/* Currency segment */}
              <div className="h-11 rounded-full bg-white/80 border border-gray-200/70 shadow-sm flex items-center px-3 relative flex-shrink-0">
                <label htmlFor="currency" className="sr-only">{t('input.currency')}</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none bg-transparent outline-none border-none text-sm font-semibold text-gray-800 pe-7"
                  aria-label={t('input.currency')}
                >
                  {Object.entries(currencies).map(([code, info]) => (
                    <option key={code} value={code}>{code} - {info.name}</option>
                  ))}
                </select>
                <svg className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Calculate button */}
              {onCalculate && (
                <button
                  type="button"
                  onClick={onCalculate}
                  disabled={loading || !netWorth || isNaN(parseFloat(netWorth))}
                  className="h-11 px-5 rounded-full text-sm font-bold text-white shadow-[0_14px_40px_rgba(16,185,129,0.35)] disabled:shadow-none disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/70 border-t-white animate-spin" aria-hidden="true" />
                      {t('input.calculating')}
                    </>
                  ) : t('input.calculate')}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-row gap-2 sm:gap-3 items-end w-full">
            {/* Net worth input */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor="net-worth"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t('input.label')}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  {currencies[currency]?.symbol || currency}
                </span>
                <input
                  id="net-worth"
                  type="text"
                  inputMode="decimal"
                  value={netWorth}
                  onChange={handleInputChange}
                  placeholder={t('input.placeholder')}
                  className="w-full pl-7 sm:pl-8 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm sm:text-base bg-white/90"
                  aria-label={t('input.label')}
                  aria-describedby={error ? 'error-message' : undefined}
                  aria-required="true"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Currency selector */}
            <div className="w-24 sm:w-32 lg:w-48 flex-shrink-0">
              <label
                htmlFor="currency"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t('input.currency')}
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-2 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-sm sm:text-base"
                aria-label={t('input.currency')}
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} - {info.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculate button */}
            {onCalculate && (
              <div className="flex-shrink-0">
                <label className="block text-xs sm:text-sm font-medium text-transparent mb-1 select-none pointer-events-none" aria-hidden="true">
                  &nbsp;
                </label>
                <button
                  type="button"
                  onClick={onCalculate}
                  disabled={loading || !netWorth || isNaN(parseFloat(netWorth))}
                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">{loading ? t('input.calculating') : t('input.calculate')}</span>
                  <span className="sm:hidden">{loading ? '...' : t('input.go')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error and status messages */}
      {((error || isStale) || (!isDock && loading)) && (
        <div className={`${isDock ? 'mt-2 pt-2' : 'mt-2 sm:mt-4 pt-2 sm:pt-4'} border-t border-gray-200`}>
          {error && (
            <div
              id="error-message"
              className="p-2 sm:p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          {isStale && (
            <div
              className="p-2 sm:p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs sm:text-sm"
              role="alert"
            >
              {t('error.apiLimit')}
            </div>
          )}

          {!isDock && (
            <div className="mt-1 sm:mt-2">
              <ProgressBar isLoading={loading} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
