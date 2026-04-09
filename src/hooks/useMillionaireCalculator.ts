import { useState, useEffect, useCallback, useRef } from 'react'
import { calculateMillionaireStatus } from '@/features/calculator/calculator'
import type { MillionaireCalculation } from '@/types'

export function useMillionaireCalculator() {
  const [netWorth, setNetWorth] = useState<string>('')
  const [currency, setCurrency] = useState<string>('USD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MillionaireCalculation | null>(null)
  const [isStale, setIsStale] = useState(false)

  const lastCalculatedRef = useRef<{ netWorth: string; currency: string } | null>(null)

  const performCalculation = useCallback((value: string, curr: string) => {
    const numericValue = parseFloat(value)
    
    if (!value || isNaN(numericValue) || numericValue <= 0) {
      setResult(null)
      setLoading(false)
      setIsStale(false)
      lastCalculatedRef.current = null
      return
    }

    setLoading(true)
    setError(null)

    calculateMillionaireStatus(numericValue, curr)
      .then((calculation) => {
        setResult(calculation)
        setIsStale(false)
        lastCalculatedRef.current = { netWorth: value, currency: curr }
      })
      .catch((err) => {
        console.error('Calculation error:', err)
        setError(err.message || 'Failed to calculate')
        // Check if it's an API limit error
        if (err.message?.includes('limit') || err.message?.includes('429')) {
          setIsStale(true)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Mark results as stale if inputs change after a calculation
  useEffect(() => {
    const last = lastCalculatedRef.current
    if (!last) return
    const changed = last.netWorth !== netWorth || last.currency !== currency
    setIsStale(changed)
  }, [netWorth, currency])

  // Manual calculation trigger
  const calculate = useCallback(() => {
    performCalculation(netWorth, currency)
  }, [netWorth, currency, performCalculation])

  return {
    netWorth,
    setNetWorth,
    currency,
    setCurrency,
    loading,
    error,
    result,
    isStale,
    calculate,
  }
}

