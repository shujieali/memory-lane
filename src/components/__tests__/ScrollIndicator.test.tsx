import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import ScrollIndicator from '../ScrollIndicator'
import type { ScrollIndicatorProps } from '../ScrollIndicator/types'

describe('ScrollIndicator', () => {
  const mockProps: ScrollIndicatorProps = {
    text: 'Test Indicator',
    show: true,
  }

  it('renders the text when show is true', () => {
    render(<ScrollIndicator {...mockProps} />)
    expect(screen.getByText(mockProps.text)).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(<ScrollIndicator {...mockProps} show={false} />)
    expect(screen.queryByText(mockProps.text)).not.toBeInTheDocument()
  })

  it('renders with the correct text', () => {
    const text = 'Different Text'
    render(<ScrollIndicator text={text} show={true} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('applies fade transition classes', () => {
    const { container } = render(<ScrollIndicator {...mockProps} />)
    // Check if the container has the MUI Fade component
    expect(container.firstChild).toHaveClass('MuiFade-root')
  })

  it('renders nothing when no text is provided', () => {
    render(<ScrollIndicator text='' show={true} />)
    // The component should render its container but with no text content
    const element = screen.getByRole('presentation')
    expect(element).toBeEmptyDOMElement()
  })
})
