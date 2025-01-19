import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom'
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

  it('calls onSearchChange when input value changes', () => {
    render(<Search {...mockProps} />)

    const input = screen.getByRole('textbox')
    const testValue = 'test search'

    fireEvent.change(input, { target: { value: testValue } })

    expect(mockProps.onSearchChange).toHaveBeenCalledWith(expect.any(Object))
    expect(mockProps.onSearchChange.mock.calls[0][0].target.value).toBe(
      testValue,
    )
  })

  it('displays the current search value', () => {
    const value = 'current search'
    render(<Search {...mockProps} search={value} />)

    expect(screen.getByRole('textbox')).toHaveValue(value)
  })
})
