import { render } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import MemoryCard from '../../features/memories/components/MemoryCard'
import { api } from '../../services/api'
import { Memory } from '../../types/memory'

// Mock the API module
jest.mock('../../services/api')
const mockApi = api as jest.Mocked<typeof api>

describe('MemoryCard', () => {
  const mockProps: Omit<Memory, 'user_id'> & {
    onEdit: (id: string) => void
    onDelete: (id: string) => void
  } = {
    id: '1',
    public_id: 'test-public-id',
    title: 'Test Memory',
    description: 'Test Description',
    image_urls: ['https://example.com/image.jpg'],
    timestamp: '2024-03-20T12:00:00Z',
    is_favorite: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders memory card with correct content', () => {
    render(<MemoryCard {...mockProps} />)

    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
    expect(screen.getByText(mockProps.description)).toBeInTheDocument()
    expect(screen.getByText('3/20/2024')).toBeInTheDocument()

    const image = screen.getByAltText(mockProps.title)
    expect(image).toHaveAttribute('src', mockProps.image_urls)
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<MemoryCard {...mockProps} />)

    const editButton = screen.getByLabelText('edit memory')
    fireEvent.click(editButton)

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockProps.id)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<MemoryCard {...mockProps} />)

    const deleteButton = screen.getByLabelText('delete memory')
    fireEvent.click(deleteButton)

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id)
  })

  it('toggles favorite state when favorite button is clicked', async () => {
    // Mock successful API responses
    mockApi.toggleFavorite
      .mockResolvedValueOnce(true) // First click: not favorite -> favorite
      .mockResolvedValueOnce(false) // Second click: favorite -> not favorite

    render(<MemoryCard {...mockProps} />)

    // Initial state: not favorite
    const favoriteButton = screen.getByLabelText('add to favorites')

    // Click to favorite
    fireEvent.click(favoriteButton)
    await waitFor(() => {
      expect(mockApi.toggleFavorite).toHaveBeenCalledWith(mockProps.id)
      expect(screen.getByLabelText('remove from favorites')).toBeInTheDocument()
    })

    // Click to unfavorite
    fireEvent.click(screen.getByLabelText('remove from favorites'))
    await waitFor(() => {
      expect(mockApi.toggleFavorite).toHaveBeenCalledWith(mockProps.id)
      expect(screen.getByLabelText('add to favorites')).toBeInTheDocument()
    })
  })

  it('handles API error when toggling favorite', async () => {
    // Mock console.error to prevent error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    // Mock API failure
    mockApi.toggleFavorite.mockRejectedValueOnce(new Error('API Error'))

    render(<MemoryCard {...mockProps} />)

    // Try to favorite
    fireEvent.click(screen.getByLabelText('add to favorites'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
      // Favorite state should not change on error
      expect(screen.getByLabelText('add to favorites')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('shows loading skeleton while image is loading', () => {
    render(<MemoryCard {...mockProps} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    const image = screen.getByAltText(mockProps.title) as HTMLImageElement
    fireEvent.load(image)

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })
})
