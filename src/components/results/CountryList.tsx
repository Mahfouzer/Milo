import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import type { MillionaireCalculation } from '@/types'
import currenciesData from '@/data/currencies.json'
import { getFlagEmoji } from '@/lib/utils/flag-emoji'

const currencies = currenciesData as Record<string, { symbol: string; name: string }>

interface CountryListProps {
  result: MillionaireCalculation | null
}

export function CountryList({ result }: CountryListProps) {
  const { t } = useTranslation()
  const countRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')

  if (!result) return null

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return result.countries
    }
    const query = searchQuery.toLowerCase()
    return result.countries.filter((countryResult) =>
      countryResult.country.name.toLowerCase().includes(query)
    )
  }, [result.countries, searchQuery])

  useEffect(() => {
    if (result && countRef.current) {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: result.millionaireCount,
        duration: 1.5,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = Math.round(obj.value).toString()
          }
        },
      })
    }
  }, [result?.millionaireCount])

  useEffect(() => {
    if (result && listRef.current) {
      const items = listRef.current.querySelectorAll('.country-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      )
    }
  }, [filteredCountries, result])

  const formatCurrency = (amount: number, _currencyCode: string): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div
      className="flex flex-col h-full min-h-0"
      role="region"
      aria-label="Countries list"
      tabIndex={0}
    >
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
          {(() => {
            const titleText = t('results.title', { count: result.millionaireCount })
            const countStr = result.millionaireCount.toString()
            const parts = titleText.split(countStr)
            
            return (
              <>
                {parts[0]}
                <span 
                  ref={countRef}
                  className="inline-block bg-clip-text text-transparent font-extrabold"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease infinite',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {result.millionaireCount}
                </span>
                {parts[1]}
              </>
            )
          })()}
        </h3>
        <span className="sr-only">{result.millionaireCount}</span>
        <style>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('results.searchPlaceholder', { defaultValue: 'Search countries...' })}
            className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-2xl bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base sm:text-sm"
            aria-label={t('results.searchPlaceholder', { defaultValue: 'Search countries' })}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label={t('results.clearSearch')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className="space-y-2.5 flex-1 overflow-y-auto min-h-0 pr-1 overscroll-contain"
      >
        {filteredCountries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('results.noResults', { defaultValue: 'No countries found' })}
          </div>
        ) : (
          filteredCountries.map((countryResult, index) => {
            const isMillionaire = countryResult.isMillionaire
            const isAlmost = result.almostMillionaire.some(
              (a) => a.country.code === countryResult.country.code
            )

            return (
            <div
              key={`${countryResult.country.code}-${index}`}
              className={`country-item group p-3 rounded-2xl border transition-all cursor-pointer shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_45px_rgba(15,23,42,0.10)] ${
                isMillionaire
                  ? 'bg-blue-50/70 border-blue-200/70 hover:bg-blue-50'
                  : isAlmost
                  ? 'bg-orange-50/70 border-orange-200/70 hover:bg-orange-50'
                  : 'bg-white/70 border-gray-200/60 hover:bg-white'
              }`}
            >
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/70 border border-gray-200/60 flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-xl" role="img" aria-label={countryResult.country.name}>
                        {getFlagEmoji(countryResult.country.code)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {countryResult.country.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {formatCurrency(
                          countryResult.localAmount,
                          countryResult.country.currency
                        )}{' '}
                        {currencies[countryResult.country.currency]?.symbol ||
                          countryResult.country.currency}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap shadow-sm border ${
                        isMillionaire
                          ? 'bg-blue-600 text-white border-blue-700/20'
                          : isAlmost
                          ? 'bg-orange-600 text-white border-orange-700/20'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {isMillionaire
                        ? t('results.status.millionaire')
                        : isAlmost
                        ? t('results.status.almost')
                        : t('results.status.not')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {result.almostMillionaire.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex-shrink-0">
          <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {t('results.almostTitle')}
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {result.almostMillionaire.map((countryResult, index) => (
              <div
                key={`almost-${countryResult.country.code}-${index}`}
                className="p-2 rounded-lg bg-orange-50 border border-orange-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0" role="img" aria-label={countryResult.country.name}>
                    {getFlagEmoji(countryResult.country.code)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {countryResult.country.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(
                        countryResult.localAmount,
                        countryResult.country.currency
                      )}{' '}
                      {currencies[countryResult.country.currency]?.symbol ||
                        countryResult.country.currency}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

