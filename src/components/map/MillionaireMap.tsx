import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import type { MillionaireCalculation } from '@/types'
import {
  createProjection,
  createPath,
  getCountryColor,
  prepareMapData,
  type MapCountry,
} from '@/lib/d3/map-utils'
import { getCountryCodeFromName } from '@/lib/d3/country-name-mapping'
import currenciesData from '@/data/currencies.json'

const currencies = currenciesData as Record<string, { symbol: string; name: string }>

// World map data - using a simplified approach
// In production, you'd load this from a TopoJSON file
const WORLD_MAP_URL = '/world-110m.json'

interface MillionaireMapProps {
  result: MillionaireCalculation | null
}

export function MillionaireMap({ result }: MillionaireMapProps) {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredCountry, setHoveredCountry] = useState<MapCountry | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [worldData, setWorldData] = useState<any>(null)

  // Load world map data
  useEffect(() => {
    fetch(WORLD_MAP_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setWorldData(data)
      })
      .catch((err) => {
        console.error('Failed to load world map:', err)
        // Fallback: create a simple map structure
        setWorldData({ type: 'FeatureCollection', features: [] })
      })
  }, [])

  // Render map
  useEffect(() => {
    if (!svgRef.current || !worldData || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = containerRef.current?.clientWidth || 800
    const height = containerRef.current?.clientHeight || 600

    svg.attr('width', width).attr('height', height)

    const projection = createProjection(width, height)
    const path = createPath(projection)

    const mapData = result ? prepareMapData(result.countries, result.almostMillionaire) : new Map<string, MapCountry>()

    // Convert TopoJSON to GeoJSON if needed
    let features: any[] = []
    if (worldData.type === 'Topology') {
      const countries = worldData.objects.countries || worldData.objects.countries_110m
      if (countries) {
        const geoJson = topojson.feature(worldData, countries as any)
        features = (geoJson as any).features || []
      }
    } else {
      features = worldData.features || []
    }

    // Filter out Israel
    features = features.filter(
      (f: any) => {
        const name = (f.properties?.name || '').toLowerCase()
        return name !== 'israel' &&
          f.properties?.ISO_A2 !== 'IL' && 
          f.properties?.iso_a2 !== 'IL' &&
          f.properties?.ISO_A3 !== 'ISR' &&
          f.properties?.iso_a3 !== 'ISR'
      }
    )

    // Create country paths
    const countries = svg
      .selectAll('.country')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', (d: any) => {
        // Try ISO codes first, then fall back to name mapping
        let code = d.properties?.ISO_A2 || 
                   d.properties?.iso_a2 || 
                   d.properties?.ISO_A3 || 
                   d.properties?.iso_a3 || ''
        
        // If no ISO code, try to get code from country name
        if (!code && d.properties?.name) {
          code = getCountryCodeFromName(d.properties.name) || ''
        }
        
        const country = mapData.get(code)
        if (!country) return '#eef2f7' // calmer default gray
        return getCountryColor(country, false)
      })
      .attr('stroke', 'rgba(255,255,255,0.95)')
      .attr('stroke-width', 0.6)
      .style('cursor', 'pointer')
      .style('pointer-events', 'all')
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
      .on('mouseenter', function (event: MouseEvent, d: any) {
        // Try ISO codes first, then fall back to name mapping
        let code = d.properties?.ISO_A2 || 
                   d.properties?.iso_a2 || 
                   d.properties?.ISO_A3 || 
                   d.properties?.iso_a3 || ''
        
        // If no ISO code, try to get code from country name
        if (!code && d.properties?.name) {
          code = getCountryCodeFromName(d.properties.name) || ''
        }
        
        const country = mapData.get(code)
        if (country) {
          setHoveredCountry(country)
          if (containerRef.current) {
            const [x, y] = d3.pointer(event, containerRef.current)
            setTooltipPosition({ x, y })
          }
          
          // Animate hover
          gsap.to(this, {
            fill: getCountryColor(country, true),
            duration: 0.2,
          })
        } else {
          // Debug: log when country not found
          console.log('Hover - Country not in mapData:', code, d.properties?.name)
        }
      })
      .on('mousemove', (event: MouseEvent) => {
        if (containerRef.current && hoveredCountry) {
          const [x, y] = d3.pointer(event, containerRef.current)
          setTooltipPosition({ x, y })
        }
      })
      .on('mouseleave', function (_event: MouseEvent, d: any) {
        setHoveredCountry(null)
        // Try ISO codes first, then fall back to name mapping
        let code = d.properties?.ISO_A2 || 
                   d.properties?.iso_a2 || 
                   d.properties?.ISO_A3 || 
                   d.properties?.iso_a3 || ''
        
        // If no ISO code, try to get code from country name
        if (!code && d.properties?.name) {
          code = getCountryCodeFromName(d.properties.name) || ''
        }
        
        const country = mapData.get(code)
        if (country) {
          gsap.to(this, {
            fill: getCountryColor(country, false),
            duration: 0.2,
          })
        }
      })

    // Animate countries on load
    countries
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((_d, i) => i * 2)
      .attr('opacity', 1)
  }, [worldData, result])

  const formatCurrency = (amount: number, _currencyCode: string): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(34,197,94,0.10),transparent_45%),linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.9))]" 
      style={{ 
        pointerEvents: 'auto', 
        zIndex: 0,
        touchAction: 'none'
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        aria-label="World map showing millionaire status"
        role="img"
        aria-describedby="map-description"
        style={{ 
          pointerEvents: 'auto', 
          display: 'block',
          position: 'relative',
          zIndex: 0
        }}
      >
        <desc id="map-description">{t('map.description')}</desc>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {!result && (
        <div className="absolute inset-x-0 top-0 bottom-[180px] sm:bottom-[80px] flex items-center justify-center pointer-events-none px-4">
          <div className="rounded-[26px] border border-white/70 bg-white/70 shadow-[0_25px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl px-5 sm:px-7 py-5 sm:py-6 text-center max-w-[480px] w-full">
            <div className="mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/85 border border-gray-200 flex items-center justify-center shadow-sm text-3xl sm:text-5xl">
              🤑
            </div>
            <div className="mt-3 sm:mt-5 font-extrabold tracking-tight text-gray-900 text-lg sm:text-4xl leading-tight">
              {t('map.emptyBefore')}{' '}
              <span className="text-emerald-600">{t('map.emptyHighlight')}</span>{' '}
              {t('map.emptyAfter')}
            </div>
            <div className="mt-3 sm:mt-6 text-xs sm:text-base text-gray-500 leading-relaxed">
              {t('map.emptySubtitle')}
            </div>
          </div>
        </div>
      )}

      {hoveredCountry && (
        <div
          className="absolute pointer-events-none z-50 whitespace-nowrap max-w-[240px] sm:max-w-none rounded-2xl border border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl px-3 py-2.5 sm:px-4 sm:py-3"
          style={{
            left: `${Math.min(tooltipPosition.x + 15, (containerRef.current?.clientWidth || 300) - 180)}px`,
            top: `${Math.min(tooltipPosition.y + 15, (containerRef.current?.clientHeight || 300) - 80)}px`,
          }}
        >
          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{hoveredCountry.name}</div>
          <div className="text-xs sm:text-sm text-gray-700 mt-0.5 sm:mt-1">
            {formatCurrency(hoveredCountry.localAmount, hoveredCountry.currency)}{' '}
            {currencies[hoveredCountry.currency]?.symbol || hoveredCountry.currency}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
            {hoveredCountry.isTrillionaire
              ? t('results.status.trillionaire')
              : hoveredCountry.isBillionaire
              ? t('results.status.billionaire')
              : hoveredCountry.isMillionaire
              ? t('results.status.millionaire')
              : hoveredCountry.isAlmost
              ? t('results.status.almost')
              : t('results.status.not')}
          </div>
        </div>
      )}
    </div>
  )
}

