import type { MillionaireCalculation } from '@/types'

export async function generateShareImage(
  result: MillionaireCalculation,
  language: string = 'en'
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#22c55e')
  gradient.addColorStop(1, '#16a34a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Title text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 64px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const titleText = getTitleText(result.millionaireCount, language)
  ctx.fillText(titleText, canvas.width / 2, 200)

  // Subtitle
  ctx.font = '32px Arial'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  const subtitleText = getSubtitleText(language)
  ctx.fillText(subtitleText, canvas.width / 2, 280)

  // Draw money emojis/SVGs (falling money effect)
  drawMoneyElements(ctx, canvas.width, canvas.height)

  // Footer text
  ctx.font = '24px Arial'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillText('millionaire-countries.com', canvas.width / 2, canvas.height - 50)

  return canvas.toDataURL('image/png')
}

function getTitleText(count: number, language: string): string {
  switch (language) {
    case 'ar':
      return `أنا مليونير في ${count} دولة`
    case 'es':
      return `Soy millonario en ${count} países`
    default:
      return `I'm a millionaire in ${count} countries`
  }
}

function getSubtitleText(language: string): string {
  switch (language) {
    case 'ar':
      return 'احسب عدد الدول التي أنت مليونير فيها'
    case 'es':
      return 'Calcula en cuántos países eres millonario'
    default:
      return "Calculate how many countries you're a millionaire in"
  }
}

function drawMoneyElements(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Draw money symbols (💰, 💵, 💸) as text or simple shapes
  const symbols = ['💰', '💵', '💸', '💴', '💶', '💷']
  const fontSize = 60

  ctx.font = `${fontSize}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Draw multiple money symbols in random positions
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width
    const y = Math.random() * (height - 200) + 100
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const opacity = 0.6 + Math.random() * 0.4

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.fillText(symbol, x, y)
    ctx.restore()
  }

  // Also draw some dollar signs as shapes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 3
  ctx.font = 'bold 40px Arial'

  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width
    const y = Math.random() * (height - 200) + 100
    const rotation = Math.random() * Math.PI * 2

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.globalAlpha = 0.4
    ctx.fillText('$', 0, 0)
    ctx.restore()
  }
}

export function downloadImage(dataUrl: string, filename: string = 'millionaire-share.png'): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function shareToFacebook(imageUrl: string, text: string): Promise<void> {
  // Try Web Share API first (works on mobile and some desktop browsers)
  if (navigator.share && navigator.canShare) {
    try {
      // Convert data URL to blob for sharing
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'millionaire-share.png', { type: 'image/png' })
      
      const shareData: any = {
        title: text,
        text: text,
        url: window.location.href,
      }
      
      // Check if files can be shared
      if (navigator.canShare({ files: [file] })) {
        shareData.files = [file]
      }
      
      await navigator.share(shareData)
      return
    } catch (error: any) {
      // User cancelled or Web Share API failed, fall back to URL sharing
      if (error.name !== 'AbortError') {
        console.log('Web Share API failed, falling back to URL sharing:', error)
      }
    }
  }
  
  // Fallback: Share URL via Facebook share dialog
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'width=600,height=400')
}

export async function shareToLinkedIn(imageUrl: string, text: string): Promise<void> {
  // Try Web Share API first
  if (navigator.share && navigator.canShare) {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'millionaire-share.png', { type: 'image/png' })
      
      const shareData: any = {
        title: text,
        text: text,
        url: window.location.href,
      }
      
      if (navigator.canShare({ files: [file] })) {
        shareData.files = [file]
      }
      
      await navigator.share(shareData)
      return
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.log('Web Share API failed, falling back to URL sharing:', error)
      }
    }
  }
  
  // Fallback: Share URL via LinkedIn share dialog
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank', 'width=600,height=400')
}

export async function shareToWhatsApp(imageUrl: string, text: string): Promise<void> {
  // Try Web Share API first
  if (navigator.share && navigator.canShare) {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'millionaire-share.png', { type: 'image/png' })
      
      const shareData: any = {
        title: text,
        text: text,
        url: window.location.href,
      }
      
      if (navigator.canShare({ files: [file] })) {
        shareData.files = [file]
      }
      
      await navigator.share(shareData)
      return
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.log('Web Share API failed, falling back to URL sharing:', error)
      }
    }
  }
  
  // Fallback: Share via WhatsApp web
  const shareText = `${text} ${window.location.href}`
  const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  window.open(url, '_blank')
}

