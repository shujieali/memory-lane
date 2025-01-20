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
  it('renders without crashing', () => {
    const { container } = renderWithRouter(
      <MemoryCardPreview memory={mockMemory} />,
    )
    expect(container).toBeInTheDocument()
  })

  it('displays memory title', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)
    expect(screen.getByText('Test Memory')).toBeInTheDocument()
  })

  it('displays description', () => {
    renderWithRouter(<MemoryCardPreview memory={mockMemory} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
