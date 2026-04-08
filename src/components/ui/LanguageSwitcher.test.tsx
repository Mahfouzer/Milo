import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSwitcher } from './LanguageSwitcher'
import '@/lib/i18n/config'

describe('LanguageSwitcher', () => {
  it('should render language buttons', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('العربية')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
  })

  it('should change language on button click', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)
    
    const arabicButton = screen.getByText('العربية')
    await user.click(arabicButton)
    
    expect(arabicButton).toHaveAttribute('aria-pressed', 'true')
  })
})

