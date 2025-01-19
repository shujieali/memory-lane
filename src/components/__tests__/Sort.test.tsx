import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom'
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

  it('renders sort and order selects', () => {
    render(<Sort {...mockProps} />)

    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/order/i)).toBeInTheDocument()
  })

  it('displays current sort and order values', () => {
    render(<Sort {...mockProps} />)

    const sortSelect = screen.getByLabelText(/sort by/i)
    const orderSelect = screen.getByLabelText(/order/i)

    expect(sortSelect).toHaveValue(mockProps.sort)
    expect(orderSelect).toHaveValue(mockProps.order)
  })

  it('calls onSortChange when sort value changes', () => {
    render(<Sort {...mockProps} />)

    const sortSelect = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortSelect, { target: { value: 'title' } })

    expect(mockProps.onSortChange).toHaveBeenCalledWith(expect.any(Object))
    expect(mockProps.onSortChange.mock.calls[0][0].target.value).toBe('title')
  })

  it('calls onOrderChange when order value changes', () => {
    render(<Sort {...mockProps} />)

    const orderSelect = screen.getByLabelText(/order/i)
    fireEvent.change(orderSelect, { target: { value: 'asc' } })

    expect(mockProps.onOrderChange).toHaveBeenCalledWith(expect.any(Object))
    expect(mockProps.onOrderChange.mock.calls[0][0].target.value).toBe('asc')
  })
})
