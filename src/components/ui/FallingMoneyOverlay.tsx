import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface FallingMoneyOverlayProps {
  show: boolean
  onComplete: () => void
}

const EMOJIS = ['💵', '💰', '💸', '💴', '💶', '💷', '🤑', '💲']

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function FallingMoneyOverlay({ show, onComplete }: FallingMoneyOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  const handleEnd = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setVisible(false)
      setFading(false)
      onComplete()
    }, 500)
  }, [onComplete])

  useEffect(() => {
    if (!show) return
    setVisible(true)
    setFading(false)
    const timer = setTimeout(handleEnd, 3000)
    return () => clearTimeout(timer)
  }, [show, handleEnd])

  if (!visible) return null

  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    left: randomBetween(0, 100),
    delay: randomBetween(0, 1.5),
    duration: randomBetween(2, 3.5),
    size: randomBetween(22, 42),
    swing: randomBetween(-40, 40),
  }))

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: fading ? 0 : 1,
        transition: 'opacity 500ms ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: 'money-bounce 0.6s ease infinite alternate',
          }}
        >
          🤑 Ka-ching! 🤑
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-50px',
            fontSize: `${item.size}px`,
            animation: `money-drop ${item.duration}s ${item.delay}s linear forwards`,
            '--swing': `${item.swing}px`,
          } as React.CSSProperties}
        >
          {item.emoji}
        </div>
      ))}

      <style>{`
        @keyframes money-drop {
          0% { top: -50px; opacity: 1; transform: translateX(0) rotate(0deg); }
          100% { top: 110vh; opacity: 0.6; transform: translateX(var(--swing, 0px)) rotate(360deg); }
        }
        @keyframes money-bounce {
          0% { transform: scale(1) translateY(0); }
          100% { transform: scale(1.08) translateY(-8px); }
        }
      `}</style>
    </div>,
    document.body
  )
}
