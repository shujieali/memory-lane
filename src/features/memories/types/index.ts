// Re-export all memory-related types
export * from '../../../types/memory'
import { Memory } from '../../../types/memory'

// Add any additional memory feature-specific types here
export interface MemoryTimelineProps {
  memories: Memory[]
  onMemoryClick?: (memoryId: string) => void
}

export interface MemoryDisplayConfig {
  showDate?: boolean
  showTime?: boolean
  dateFormat?: Intl.DateTimeFormatOptions
}
