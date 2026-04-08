export interface Country {
  code: string
  name: string
  currency: string
  currencySymbol?: string
}

export interface CurrencyRate {
  code: string
  rate: number
}

export interface CountryResult {
  country: Country
  localAmount: number
  isMillionaire: boolean
  distanceToMillion: number // How far from 1M (negative if over, positive if under)
}

export interface CurrencyProvider {
  name: string
  getRates(baseCurrency: string): Promise<CurrencyRate[]>
  isAvailable(): boolean
}

export interface MillionaireCalculation {
  countries: CountryResult[]
  millionaireCount: number
  almostMillionaire: CountryResult[] // Top 3 closest
}

