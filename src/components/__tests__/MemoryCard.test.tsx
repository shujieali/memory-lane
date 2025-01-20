import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import MemoryCard from '../../features/memories/components/MemoryCard'
import { SettingsProvider } from '../../context/SettingsContext'
import { Memory } from '../../types/memory'
import { ShareMemoryContext } from '../../context/contexts'
import { ShareMemoryContextType } from '../../context/types'

// Mock api
jest.mock('../../services/api', () => ({
  api: {
    toggleFavorite: jest.fn(),
  },
}))

const mockMemory: Memory = {
  id: '1',
  user_id: 'user1',
  title: 'Test Memory',
  description: 'Test Description',
  image_urls: ['https://example.com/image.jpg'],
  timestamp: '2024-01-20T12:00:00Z',
  is_favorite: false,
  tags: ['test'],
  public_id: 'test-public-id',
}

const mockShareContext: ShareMemoryContextType = {
  shareMemory: jest.fn(),
}

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <SettingsProvider>
        <ShareMemoryContext.Provider value={mockShareContext}>
          {ui}
        </ShareMemoryContext.Provider>
      </SettingsProvider>
    </BrowserRouter>,
  )
}

describe('MemoryCard', () => {
  const mockProps = {
    ...mockMemory,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }

  it('renders memory card with basic content', () => {
    renderWithProviders(<MemoryCard {...mockProps} />)
    expect(screen.getByText('Test Memory')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders image placeholder correctly', () => {
    renderWithProviders(<MemoryCard {...mockProps} />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders loading skeleton', () => {
    renderWithProviders(<MemoryCard {...mockProps} />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })
})
