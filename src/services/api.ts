import { Memory } from '../types/memory'
import { handleUnauthorized, withAuth } from '../utils/apiUtils'

const API_BASE_URL = 'http://localhost:4001'

export interface CreateMemoryPayload {
  user_id: string
  title: string
  description: string
  image_url: string
  timestamp: string
}

export interface UpdateMemoryPayload {
  title: string
  description: string
  image_url: string
  timestamp: string
}

export const api = {
  async getMemories(userId: string): Promise<Memory[]> {
    const response = await fetch(`${API_BASE_URL}/memories?user_id=${userId}`, {
      headers: withAuth(),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to fetch memories')
    }
    const data = await response.json()
    return data.memories
  },

  async createMemory(payload: CreateMemoryPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: 'POST',
      headers: withAuth({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to create memory')
    }
  },

  async updateMemory(id: string, payload: UpdateMemoryPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'PUT',
      headers: withAuth({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to update memory')
    }
  },

  async deleteMemory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to delete memory')
    }
  },

  async toggleFavorite(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}/favorite`, {
      method: 'POST',
      headers: withAuth(),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to toggle favorite status')
    }
    const data = await response.json()
    return data.is_favorite
  },
}
