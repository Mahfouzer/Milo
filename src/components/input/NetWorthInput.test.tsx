import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NetWorthInput } from './NetWorthInput'
import '@/lib/i18n/config'

describe('NetWorthInput', () => {
  const defaultProps = {
    netWorth: '',
    setNetWorth: vi.fn(),
    currency: 'USD',
    setCurrency: vi.fn(),
    loading: false,
    error: null,
    isStale: false,
  }

  it('should render input fields', () => {
    render(<NetWorthInput {...defaultProps} />)
    expect(screen.getByLabelText(/net worth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument()
  })

  it('should call setNetWorth on input change', async () => {
    const user = userEvent.setup()
    const setNetWorth = vi.fn()
    render(<NetWorthInput {...defaultProps} setNetWorth={setNetWorth} />)
    
    const input = screen.getByLabelText(/net worth/i)
    await user.type(input, '1000000')
    
    expect(setNetWorth).toHaveBeenCalled()
  })

  it('should display error message when error exists', () => {
    render(<NetWorthInput {...defaultProps} error="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should display stale data warning', () => {
    render(<NetWorthInput {...defaultProps} isStale={true} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

