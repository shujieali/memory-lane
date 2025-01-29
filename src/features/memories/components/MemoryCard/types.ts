import type { Memory } from '.././../../../types/memory'

export interface MemoryCardProps extends Omit<Memory, 'user_id'> {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isPublic?: boolean
  disabled?: boolean
  isDetailView?: boolean
}
