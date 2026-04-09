import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MillionaireCalculation } from '@/types'
import {
  generateShareImage,
  downloadImage,
} from '@/features/sharing/image-generator'

interface ShareButtonsProps {
  result: MillionaireCalculation | null
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const { t, i18n } = useTranslation()
  const [generating, setGenerating] = useState(false)

  if (!result) return null

  const shareUrl = window.location.href
  const shareTitle = t('results.title', { count: result.millionaireCount })
  const shareDescription = t('subtitle', { defaultValue: "Calculate how many countries you're a millionaire in" })
  const shareText = `${shareTitle} - ${shareDescription}`

  // Simple, reliable sharing via platform URLs opened in new windows.
  // This approach works on all browsers without popup blocker issues
  // because window.open is called synchronously from the click handler.
  const handleShare = async (platform: 'facebook' | 'linkedin' | 'x') => {
    // Mobile-first: prefer native share sheet (works well with LinkedIn app)
    if (platform === 'linkedin' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch {
        // fall back to web share URL
      }
    }

    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)
    const encodedText = encodeURIComponent(shareText)

    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'x':
        url = `https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`
        break
    }

    // Prefer a normal new tab: LinkedIn often blocks/limits popup windows
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.assign(url)
    }
  }

  const handleDownload = async () => {
    if (!result) return

    setGenerating(true)
    try {
      const imageUrl = await generateShareImage(result, i18n.language)
      downloadImage(imageUrl)
    } catch (error) {
      console.error('Failed to generate share image:', error)
      alert('Failed to download image. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const shareButtonBase =
    'group inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200/70 bg-white/75 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:bg-white/90 hover:shadow-[0_14px_45px_rgba(15,23,42,0.10)] transition-all active:scale-[0.98]'

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        {t('share.title')}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleShare('facebook')}
          className={shareButtonBase}
          aria-label={t('share.facebook')}
          title={t('share.facebook')}
        >
          <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M22 12.06C22 6.52 17.52 2 11.94 2S2 6.52 2 12.06C2 17.06 5.66 21.2 10.44 22v-7.02H7.9v-2.92h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.92h-2.3V22C18.34 21.2 22 17.06 22 12.06z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleShare('linkedin')}
          className={shareButtonBase}
          aria-label={t('share.linkedin')}
          title={t('share.linkedin')}
        >
          <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleShare('x')}
          className={shareButtonBase}
          aria-label={t('share.x', { defaultValue: 'Share on X' })}
          title={t('share.x', { defaultValue: 'Share on X' })}
        >
          <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M18.901 2H22l-6.76 7.73L23.2 22h-6.23l-4.88-6.42L6.48 22H3.38l7.23-8.27L1 2h6.39l4.41 5.86L18.901 2zm-1.09 18.16h1.72L6.46 3.74H4.62l13.19 16.42z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={generating}
          className={`${shareButtonBase} disabled:opacity-60 disabled:cursor-not-allowed`}
          aria-label={t('share.download')}
          title={t('share.download')}
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
