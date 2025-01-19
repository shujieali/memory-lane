export interface Memory {
  id: string
  user_id: string
  title: string
  description: string
  image_urls: string[]
  timestamp: string
  is_favorite: boolean
  tags?: string[]
  public_id: string
}

export interface MemoryFormData {
  title: string
  description: string
}
export interface MemoryFormErrors {
  title?: string
  description?: string
  image_urls?: string
}

export type MemoryFormState = Partial<
  Pick<Memory, 'title' | 'description' | 'tags' | 'image_urls'>
>
