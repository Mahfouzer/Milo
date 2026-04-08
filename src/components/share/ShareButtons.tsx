import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share'
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
  const handleShare = (platform: 'facebook' | 'linkedin' | 'whatsapp') => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)
    const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`)

    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}`
        break
    }

    // Open in a centered popup window
    const width = 600
    const height = 500
    const left = Math.round((window.screen.width - width) / 2)
    const top = Math.round((window.screen.height - height) / 2)
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`

    const win = window.open(url, `share_${platform}`, features)
    if (!win || win.closed) {
      // Popup was blocked - try opening in a new tab instead
      window.open(url, '_blank')
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">{t('share.title')}</h3>
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => handleShare('facebook')}
          className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label={t('share.facebook')}
          title={t('share.facebook')}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 group">
            <FacebookIcon 
              size={28} 
              round={false} 
              bgStyle={{ fill: 'transparent' }}
            />
          </div>
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label={t('share.linkedin')}
          title={t('share.linkedin')}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 group">
            <LinkedinIcon 
              size={28} 
              round={false} 
              bgStyle={{ fill: 'transparent' }}
            />
          </div>
        </button>
        
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label={t('share.whatsapp')}
          title={t('share.whatsapp')}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 group">
            <WhatsappIcon 
              size={28} 
              round={false} 
              bgStyle={{ fill: 'transparent' }}
            />
          </div>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('share.download')}
          title={t('share.download')}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 group">
            <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
