import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapboxUsage } from './MapboxUsage'

describe('MapboxUsage', () => {
  it('displays the request count', () => {
    render(<MapboxUsage count={1234} />)
    expect(screen.getByText(/1,234/)).toBeInTheDocument()
  })

  it('displays the free tier limit', () => {
    render(<MapboxUsage count={0} />)
    expect(screen.getByText(/200,000/)).toBeInTheDocument()
  })

  it('shows green when usage is low', () => {
    const { container } = render(<MapboxUsage count={100} />)
    const bar = container.querySelector('[data-testid="usage-bar"]')
    expect(bar).toBeDefined()
  })
})
