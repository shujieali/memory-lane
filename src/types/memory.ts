export interface Memory {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string
  timestamp: string
  is_favorite: boolean
  tags?: string[]
}

export interface MemoryFormData {
  title: string
  description: string
}

export interface MemoryFormErrors {
  title?: string
  description?: string
}
