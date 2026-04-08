import type { Country, CountryResult, MillionaireCalculation } from '@/types'
import { currencyService } from '../currency/currency-service'
import countriesData from '@/data/countries.json'

const COUNTRIES = countriesData as Country[]
const MILLION = 1_000_000
const ALMOST_MILLION = 900_000

export async function calculateMillionaireStatus(
  netWorth: number,
  baseCurrency: string
): Promise<MillionaireCalculation> {
  if (netWorth <= 0 || isNaN(netWorth)) {
    return {
      countries: [],
      millionaireCount: 0,
      almostMillionaire: [],
    }
  }

  // Get exchange rates
  const rates = await currencyService.getRates(baseCurrency.toUpperCase())
  const rateMap = new Map(rates.map((r) => [r.code, r.rate]))

  // Calculate for each country
  const results: CountryResult[] = COUNTRIES.map((country) => {
    const rate = rateMap.get(country.currency) || 1
    const localAmount = netWorth * rate
    const isMillionaire = localAmount >= MILLION
    const distanceToMillion = MILLION - localAmount

    return {
      country,
      localAmount,
      isMillionaire,
      distanceToMillion,
    }
  })

  // Sort by amount (descending)
  results.sort((a, b) => b.localAmount - a.localAmount)

  // Find millionaires
  const millionaires = results.filter((r) => r.isMillionaire)

  // Find almost millionaires (local amount >= 900,000 but < 1,000,000)
  const almostMillionaires = results
    .filter((r) => !r.isMillionaire && r.localAmount >= ALMOST_MILLION)
    .sort((a, b) => a.distanceToMillion - b.distanceToMillion)

  return {
    countries: results,
    millionaireCount: millionaires.length,
    almostMillionaire: almostMillionaires,
  }
}

