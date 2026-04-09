import * as d3 from 'd3'
import * as d3Geo from 'd3-geo'
import type { CountryResult } from '@/types'

export interface MapCountry {
  code: string
  name: string
  isMillionaire: boolean
  isAlmost: boolean
  isBillionaire: boolean
  isTrillionaire: boolean
  localAmount: number
  currency: string
}

export function createProjection(width: number, height: number) {
  return d3Geo
    .geoMercator()
    .scale(width / 6.28)
    .translate([width / 2, height / 2])
}

export function createPath(projection: d3Geo.GeoProjection) {
  return d3.geoPath().projection(projection)
}

export function getCountryColor(
  country: MapCountry,
  hovered: boolean
): string {
  if (country.isMillionaire) {
    if (hovered) {
      return '#60a5fa' // blue-400 (lighter blue on hover)
    }
    return '#3b82f6' // blue-500 (millionaire)
  }
  if (country.isAlmost) {
    if (hovered) {
      return '#fb923c' // orange-400 (lighter orange on hover)
    }
    return '#f97316' // orange-500 (almost millionaire)
  }
  return '#e5e7eb' // gray-200 (not millionaire)
}

export function prepareMapData(
  results: CountryResult[],
  almostMillionaire: CountryResult[]
): Map<string, MapCountry> {
  const map = new Map<string, MapCountry>()
  const almostCodes = new Set(almostMillionaire.map((r) => r.country.code))
  const BILLION = 1_000_000_000
  const TRILLION = 1_000_000_000_000

  results.forEach((result) => {
    const isTrillionaire = result.localAmount >= TRILLION
    const isBillionaire = !isTrillionaire && result.localAmount >= BILLION
    map.set(result.country.code, {
      code: result.country.code,
      name: result.country.name,
      isMillionaire: result.isMillionaire,
      isAlmost: almostCodes.has(result.country.code),
      isBillionaire,
      isTrillionaire,
      localAmount: result.localAmount,
      currency: result.country.currency,
    })
  })

  return map
}

