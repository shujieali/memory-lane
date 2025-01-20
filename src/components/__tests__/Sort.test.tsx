import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sort from '../Sort'

describe('Sort', () => {
  const mockProps = {
    sort: 'timestamp',
    order: 'desc',
    onSortChange: jest.fn(),
    onOrderChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sort button with text', () => {
    render(<Sort {...mockProps} />)
    expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument()
  })

  it('renders sort icon', () => {
    render(<Sort {...mockProps} />)
    expect(screen.getByTestId('SortIcon')).toBeInTheDocument()
  })
})
