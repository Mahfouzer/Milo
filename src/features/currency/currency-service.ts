import type { CurrencyProvider, CurrencyRate } from '@/types'

// ExchangeRate-API provider (free tier)
class ExchangeRateAPIProvider implements CurrencyProvider {
  name = 'ExchangeRate-API'
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest'

  async getRates(baseCurrency: string): Promise<CurrencyRate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${baseCurrency}`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      
      return Object.entries(data.rates).map(([code, rate]) => ({
        code,
        rate: rate as number,
      }))
    } catch (error) {
      console.error('ExchangeRate-API error:', error)
      throw error
    }
  }

  isAvailable(): boolean {
    return true // Free tier is always available
  }
}

// Fixer.io provider (for future use)
// @ts-expect-error - Reserved for future use
class FixerIOProvider implements CurrencyProvider {
  name = 'Fixer.io'
  private apiKey?: string
  private baseUrl = 'https://api.fixer.io/latest'

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async getRates(baseCurrency: string): Promise<CurrencyRate[]> {
    if (!this.apiKey) {
      throw new Error('Fixer.io API key not provided')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?access_key=${this.apiKey}&base=${baseCurrency}`
      )
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      
      if (!data.success && data.error) {
        throw new Error(data.error.info || 'Fixer.io API error')
      }

      return Object.entries(data.rates).map(([code, rate]) => ({
        code,
        rate: rate as number,
      }))
    } catch (error) {
      console.error('Fixer.io error:', error)
      throw error
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }
}

// Currency service with provider abstraction
export class CurrencyService {
  private providers: CurrencyProvider[] = []
  private currentProvider: CurrencyProvider | null = null
  private cache: Map<string, { rates: CurrencyRate[]; timestamp: number }> = new Map()
  private cacheTTL = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    // Initialize with default provider
    this.providers.push(new ExchangeRateAPIProvider())
    this.currentProvider = this.providers[0]
  }

  // Add a new provider
  addProvider(provider: CurrencyProvider): void {
    this.providers.push(provider)
  }

  // Set the active provider
  setProvider(providerName: string): void {
    const provider = this.providers.find((p) => p.name === providerName)
    if (provider && provider.isAvailable()) {
      this.currentProvider = provider
    } else {
      throw new Error(`Provider ${providerName} not found or not available`)
    }
  }

  // Get rates with caching
  async getRates(baseCurrency: string, useCache = true): Promise<CurrencyRate[]> {
    const cacheKey = baseCurrency.toUpperCase()
    
    // Check cache first
    if (useCache) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.rates
      }
    }

    if (!this.currentProvider) {
      throw new Error('No currency provider available')
    }

    try {
      const rates = await this.currentProvider.getRates(baseCurrency)
      
      // Cache the results
      this.cache.set(cacheKey, {
        rates,
        timestamp: Date.now(),
      })

      return rates
    } catch (error) {
      // Try fallback to cached data if available
      const cached = this.cache.get(cacheKey)
      if (cached) {
        console.warn('Using cached currency data due to API error')
        return cached.rates
      }
      throw error
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get available providers
  getAvailableProviders(): CurrencyProvider[] {
    return this.providers.filter((p) => p.isAvailable())
  }
}

// Singleton instance
export const currencyService = new CurrencyService()

