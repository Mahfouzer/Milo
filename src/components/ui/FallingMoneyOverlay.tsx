import { useEffect, useState, useRef, useMemo } from 'react'
import { gsap } from 'gsap'

interface FallingMoneyOverlayProps {
  show: boolean
  onComplete: () => void
}

interface MoneyItem {
  id: number
  emoji: string
  left: number
  delay: number
  duration: number
  size: number
  rotation: number
  swingAmount: number
}

const MONEY_EMOJIS = ['💵', '💰', '💸', '💴', '💶', '💷', '🤑', '💲']

function generateMoneyItems(count: number): MoneyItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.5 + Math.random() * 1.5,
    size: 20 + Math.random() * 30,
    rotation: Math.random() * 360,
    swingAmount: 15 + Math.random() * 30,
  }))
}

export function FallingMoneyOverlay({ show, onComplete }: FallingMoneyOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Generate items once per show
  const moneyItems = useMemo(() => (show ? generateMoneyItems(40) : []), [show])

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Animate in
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      }

      // Hide after 2.5 seconds
      const timer = setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
              setIsVisible(false)
              onCompleteRef.current()
            },
          })
        } else {
          setIsVisible(false)
          onCompleteRef.current()
        }
      }, 2500)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] overflow-hidden pointer-events-none"
      style={{ opacity: 0 }}
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-extrabold text-white drop-shadow-lg animate-bounce">
          🤑 Ka-ching! 🤑
        </div>
      </div>

      {/* Falling money emojis */}
      {moneyItems.map((item) => (
        <span
          key={item.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${item.left}%`,
            top: '-10%',
            fontSize: `${item.size}px`,
            animation: `money-fall ${item.duration}s ${item.delay}s ease-in forwards, money-swing ${item.duration * 0.5}s ${item.delay}s ease-in-out infinite alternate`,
            transform: `rotate(${item.rotation}deg)`,
            '--swing-amount': `${item.swingAmount}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
      ))}

      {/* CSS animations */}
      <style>{`
        @keyframes money-fall {
          0% {
            top: -10%;
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        @keyframes money-swing {
          0% {
            transform: translateX(calc(-1 * var(--swing-amount, 20px))) rotate(0deg);
          }
          100% {
            transform: translateX(var(--swing-amount, 20px)) rotate(15deg);
          }
        }
      `}</style>
    </div>
  )
}
