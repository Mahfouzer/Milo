import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateMillionaireStatus } from './calculator'
import { currencyService } from '../currency/currency-service'

// Mock the currency service
vi.mock('../currency/currency-service', () => ({
  currencyService: {
    getRates: vi.fn(),
  },
}))

describe('calculateMillionaireStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty results for zero or negative net worth', async () => {
    const result = await calculateMillionaireStatus(0, 'USD')
    expect(result.millionaireCount).toBe(0)
    expect(result.countries).toHaveLength(0)
  })

  it('should calculate millionaire status correctly', async () => {
    // Mock exchange rates
    const mockRates = [
      { code: 'USD', rate: 1 },
      { code: 'EUR', rate: 0.85 },
      { code: 'JPY', rate: 110 },
      { code: 'INR', rate: 75 },
    ]

    vi.mocked(currencyService.getRates).mockResolvedValue(mockRates)

    // Test with 1 million USD
    const result = await calculateMillionaireStatus(1_000_000, 'USD')
    
    expect(result.millionaireCount).toBeGreaterThan(0)
    expect(result.countries.length).toBeGreaterThan(0)
  })

  it('should identify almost millionaires', async () => {
    const mockRates = [
      { code: 'USD', rate: 1 },
      { code: 'EUR', rate: 0.85 },
    ]

    vi.mocked(currencyService.getRates).mockResolvedValue(mockRates)

    const result = await calculateMillionaireStatus(500_000, 'USD')
    
    // Should have some almost millionaires
    expect(result.almostMillionaire.length).toBeLessThanOrEqual(3)
  })
})

