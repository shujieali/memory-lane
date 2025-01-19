import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import MemoryCardPreview from '..'
import { Memory } from '../../../../../types/memory'

const mockMemory: Memory = {
  id: '1',
  user_id: 'user1',
  public_id: 'test-public-id',
  title: 'Test Memory',
  description: 'Test Description',
  image_urls: ['https://example.com/image.jpg'],
  timestamp: '2024-03-20T12:00:00Z',
  is_favorite: false,
  tags: ['test'],
}

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('MemoryCardPreview', () => {
  it('renders preview card with memory details', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)

    expect(screen.getByText(mockMemory.title)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      mockMemory.image_urls[0],
    )
    expect(screen.getByText('3/20/2024')).toBeInTheDocument()
  })

  it('shows loading state while image is loading', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    const image = screen.getByRole('img') as HTMLImageElement
    image.dispatchEvent(new Event('load'))

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })

  it('applies hover effect class on mouse enter', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)

    const card = screen.getByTestId('memory-preview')
    card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

    expect(card).toHaveClass('hover')
  })

  it('creates correct memory link', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining(mockMemory.id))
  })
})
