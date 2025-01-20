import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Search from '../Search'

describe('Search', () => {
  const mockProps = {
    search: '',
    onSearchChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    render(<Search {...mockProps} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays current search value', () => {
    const value = 'test search'
    render(<Search {...mockProps} search={value} />)
    expect(screen.getByRole('textbox')).toHaveValue(value)
  })

  it('renders with correct label', () => {
    render(<Search {...mockProps} />)
    expect(screen.getByLabelText('Search Memories')).toBeInTheDocument()
  })
})
