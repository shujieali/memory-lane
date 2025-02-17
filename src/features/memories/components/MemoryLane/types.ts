import type { Memory } from '../../../../types/memory'

export interface MemoryLaneProps {
  memories: Memory[]
  loading: boolean
  error: string
  isPublic?: boolean
}
