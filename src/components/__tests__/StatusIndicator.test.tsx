import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusIndicator from '../StatusIndicator'

describe('StatusIndicator', () => {
  it('shows loading state', () => {
    render(<StatusIndicator loading={true} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error message', () => {
    const errorMessage = 'Test error message'
    render(<StatusIndicator error={errorMessage} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('shows empty message', () => {
    const emptyMessage = 'No items found'
    render(<StatusIndicator emptyMessage={emptyMessage} />)
    expect(screen.getByText(emptyMessage)).toBeInTheDocument()
  })

  it('prioritizes loading over error', () => {
    render(<StatusIndicator loading={true} error='Error message' />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('shows default message when no props are provided', () => {
    render(<StatusIndicator />)
    expect(screen.getByText('No content available')).toBeInTheDocument()
  })
})
