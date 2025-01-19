import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
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

  it('prioritizes loading state over error and empty states', () => {
    const { rerender } = render(
      <StatusIndicator
        loading={true}
        error='Error message'
        emptyMessage='Empty message'
      />,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
    expect(screen.queryByText('Empty message')).not.toBeInTheDocument()

    // Test that error is shown when not loading
    rerender(
      <StatusIndicator
        loading={false}
        error='Error message'
        emptyMessage='Empty message'
      />,
    )

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Empty message')).not.toBeInTheDocument()
  })

  it('renders nothing when no props are provided', () => {
    const { container } = render(<StatusIndicator />)
    expect(container).toBeEmptyDOMElement()
  })
})
