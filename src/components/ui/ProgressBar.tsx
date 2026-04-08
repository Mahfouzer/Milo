import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ProgressBarProps {
  isLoading: boolean
  className?: string
}

export function ProgressBar({ isLoading, className = '' }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoading && barRef.current) {
      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 0.5,
          ease: 'power2.out',
        }
      )
    } else if (!isLoading && barRef.current) {
      gsap.to(barRef.current, {
        width: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (barRef.current) {
            gsap.to(barRef.current, {
              opacity: 0,
              duration: 0.2,
            })
          }
        },
      })
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className={`h-1 bg-gray-200 overflow-hidden ${className}`}>
      <div
        ref={barRef}
        className="h-full bg-primary-500 transition-all"
        style={{ width: '0%' }}
        role="progressbar"
        aria-valuenow={isLoading ? 50 : 100}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading"
      />
    </div>
  )
}

