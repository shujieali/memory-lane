import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ScrollIndicator from '../ScrollIndicator'

describe('ScrollIndicator', () => {
  const mockProps = {
    text: 'Test Indicator',
    show: true,
  }

  it('renders the text when show is true', () => {
    render(<ScrollIndicator {...mockProps} />)
    expect(screen.getByText(mockProps.text)).toBeInTheDocument()
  })

  it('does not show text when show is false', () => {
    render(<ScrollIndicator {...mockProps} show={false} />)
    // MUI Fade keeps the element in DOM but with opacity: 0
    const element = screen.getByText(mockProps.text)
    expect(element).toHaveStyle({ opacity: '0' })
  })

  it('renders with the correct text', () => {
    const text = 'Different Text'
    render(<ScrollIndicator text={text} show={true} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('handles empty text', () => {
    render(<ScrollIndicator text='' show={true} />)
    const { container } = render(<ScrollIndicator text='' show={true} />)
    expect(container).toBeInTheDocument()
  })
})
