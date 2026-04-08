import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { useEffect, useRef, useState } from 'react'
import { useMillionaireCalculator } from '@/hooks/useMillionaireCalculator'
import { NetWorthInput } from '@/components/input/NetWorthInput'
import { MillionaireMap } from '@/components/map/MillionaireMap'
import { CountryList } from '@/components/results/CountryList'
import { AppHeader } from '@/components/header/AppHeader'
import { Footer } from '@/components/footer/Footer'
import { FallingMoneyOverlay } from '@/components/ui/FallingMoneyOverlay'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: IndexComponent,
})

type SheetSnap = 'collapsed' | 'half' | 'expanded'

function IndexComponent() {
  const {
    netWorth,
    setNetWorth,
    currency,
    setCurrency,
    loading,
    error,
    result,
    isStale,
    calculate,
  } = useMillionaireCalculator()

  const [desktopResultsOpen, setDesktopResultsOpen] = useState(true)
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('collapsed')
  const [showMoneyOverlay, setShowMoneyOverlay] = useState(false)
  const previousLoadingRef = useRef(loading)
  const hasShownOverlayRef = useRef(false)

  // Show overlay when loading completes
  useEffect(() => {
    if (previousLoadingRef.current && !loading && result && !hasShownOverlayRef.current) {
      setShowMoneyOverlay(true)
      hasShownOverlayRef.current = true
    }
    previousLoadingRef.current = loading
  }, [loading, result])

  // On results: open desktop panel; open mobile sheet to half
  useEffect(() => {
    if (result) {
      setDesktopResultsOpen(true)
      setSheetSnap('half')
    }
  }, [result])

  const handleOverlayComplete = () => {
    setShowMoneyOverlay(false)
  }

  const getSheetTranslate = (snap: SheetSnap) => {
    switch (snap) {
      case 'expanded':
        return 'translateY(0%)'
      case 'half':
        return 'translateY(45%)'
      case 'collapsed':
      default:
        return 'translateY(calc(100% - 72px))'
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Background mesh */} 
      <div className="h-full w-full bg-[radial-gradient(circle_at_10%_10%,rgba(245,158,11,0.35),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(34,197,94,0.30),transparent_48%),radial-gradient(circle_at_70%_95%,rgba(59,130,246,0.30),transparent_52%),linear-gradient(180deg,#f8fafc,rgba(248,250,252,0.75))] p-2 sm:p-4 flex flex-col gap-2">
        {/* Transparent page header (outside the card) */} 
        <div className="px-2 sm:px-4 pt-1">
          <AppHeader netWorth={netWorth} currency={currency} result={result} />
        </div>

        <div className="mx-auto w-full flex-1 min-h-0 max-w-none">
          {/* Gradient frame */} 
          <div className="relative h-full rounded-[30px] p-[1.5px] bg-[linear-gradient(90deg,rgba(34,197,94,0.55),rgba(59,130,246,0.55),rgba(245,158,11,0.55))] shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
          {/* App card */} 
          <div className="relative w-full h-full overflow-hidden rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl">
            {/* noise overlay */} 
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22100%22%20height=%22100%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.8%22%20numOctaves=%224%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22%20opacity=%220.4%22/%3E%3C/svg%3E')] bg-repeat" />

            {/* Main grid */} 
            <div className="relative h-full">
              <div
                className={`lg:grid lg:h-full ${
                  result ? 'lg:grid-cols-[380px_1fr]' : 'lg:grid-cols-1'
                }`}
              >
                {/* Results panel (desktop) - only show after first result */} 
                {result && (
                  <aside className="hidden lg:block h-full border-r border-gray-200/60 bg-white/55 overflow-hidden">
                    <div className="h-full min-h-0 flex flex-col overflow-hidden">
                      <div className="flex-1 min-h-0 px-4 pt-4 pb-4 overflow-hidden">
                        {desktopResultsOpen ? (
                          <div className="h-full min-h-0 lg:h-[calc(100vh-170px)] rounded-2xl border border-gray-200/60 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,0.06)] overflow-hidden">
                            {/* Hard height clamp so the panel never grows with content */} 
                            <div className="h-full min-h-0 p-3 flex flex-col">
                              <CountryList result={result} />
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-0 rounded-2xl border border-gray-200/60 bg-white/50" />
                        )}
                      </div>
                    </div>
                  </aside>
                )}

                {/* Map stage */} 
                <section className="relative">
                  <div className="relative h-[72vh] lg:h-full">
                    <div className="absolute inset-0 p-3 sm:p-4">
                      <div className="relative h-full w-full rounded-[22px] border border-gray-200/60 bg-white/55 shadow-[0_18px_60px_rgba(15,23,42,0.08)] overflow-hidden">
                        <div className="absolute inset-0">
                          <MillionaireMap result={result} />
                        </div>
                        <FallingMoneyOverlay show={showMoneyOverlay} onComplete={handleOverlayComplete} />

                        {/* Floating input dock overlay (like reference) */} 
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[min(860px,calc(100%-32px))] z-20 pointer-events-auto">
                          <div className="rounded-[999px] border border-gray-200/70 bg-white/90 shadow-[0_18px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl px-3 sm:px-4 py-3">
                            <NetWorthInput
                              netWorth={netWorth}
                              setNetWorth={setNetWorth}
                              currency={currency}
                              setCurrency={setCurrency}
                              loading={loading}
                              error={error}
                              isStale={isStale}
                              onCalculate={calculate}
                              variant="dock"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile bottom sheet */} 
                  {result && (
                    <div className="lg:hidden">
                      <div
                        className="fixed left-0 right-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
                        style={{
                          transform: getSheetTranslate(sheetSnap),
                          transition: 'transform 240ms ease',
                          willChange: 'transform',
                        }}
                        aria-label="Results bottom sheet"
                      >
                        <div className="mx-auto w-full max-w-[1200px]">
                          <div className="rounded-[22px] border border-gray-200/60 bg-white/90 shadow-[0_25px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl overflow-hidden">
                            <button
                              type="button"
                              className="w-full px-4 pt-3 pb-2 flex items-center justify-between"
                              onClick={() => {
                                setSheetSnap((prev) => (prev === 'collapsed' ? 'half' : 'collapsed'))
                              }}
                              aria-label="Toggle results sheet"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-10 rounded-full bg-gray-300" aria-hidden="true" />
                                <span className="text-sm font-semibold text-gray-800">Results</span>
                              </div>
                              <span className="text-xs font-semibold text-gray-600">
                                {result.millionaireCount} millionaire
                              </span>
                            </button>

                            {/* Snap controls (scaffold) */} 
                            <div className="px-4 pb-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSheetSnap('collapsed')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                  sheetSnap === 'collapsed'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                Min
                              </button>
                              <button
                                type="button"
                                onClick={() => setSheetSnap('half')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                  sheetSnap === 'half'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                Half
                              </button>
                              <button
                                type="button"
                                onClick={() => setSheetSnap('expanded')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                  sheetSnap === 'expanded'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                Full
                              </button>
                            </div>

                            <div className="border-t border-gray-200/60">
                              <div className="max-h-[60vh] overflow-y-auto p-3">
                                <CountryList result={result} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Removed bottom dock row; dock now floats over map */} 
            </div>
          </div>
          </div>
        </div>

        {/* Transparent page footer (outside the card) */} 
        <div className="px-2 sm:px-4 pb-1">
          <Footer />
        </div>
      </div>
    </div>
  )
}
