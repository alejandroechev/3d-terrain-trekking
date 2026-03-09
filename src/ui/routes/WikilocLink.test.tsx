import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WikilocLink } from './WikilocLink'

describe('WikilocLink', () => {
  it('renders a link to Wikiloc with Spanish text', () => {
    render(<WikilocLink />)
    expect(screen.getByText(/Buscar en Wikiloc/i)).toBeInTheDocument()
  })

  it('links to Wikiloc Puerto Varas hiking page', () => {
    render(<WikilocLink />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('wikiloc.com')
    expect(link.getAttribute('href')).toContain('puerto-varas')
  })

  it('opens in a new tab', () => {
    render(<WikilocLink />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
  })
})
