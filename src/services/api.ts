import axios, { AxiosProgressEvent } from 'axios'
import { Memory } from '../types/memory'
import { User } from '../types/user'
import { FileProgress, CreateMemoryPayload, UpdateMemoryPayload } from './types'
import { handleUnauthorized, withAuth, getHeaders } from './utils'
import { getApiBaseUrl } from './config'

const API_BASE_URL = getApiBaseUrl()

export const api = {
  async getMemories(
    userId: string,
    page: number = 1,
    search: string = '',
    sort: string = 'timestamp',
    order: string = 'desc',
  ): Promise<Memory[]> {
    const response = await fetch(
      `${API_BASE_URL}/memories?user_id=${userId}&page=${page}&search=${search}&sort=${sort}&order=${order}`,
      {
        headers: withAuth(),
      },
    )
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to fetch memories')
    }
    const data = await response.json()
    return data.memories
  },

  async getUploadUrl(options?: { contentType?: string }): Promise<{
    url: string
    fields: Record<string, string>
    fileUrl: string
  }> {
    const response = await fetch(
      `${API_BASE_URL}/api/storage/url${
        options?.contentType ? `?contentType=${options.contentType}` : ''
      }`,
      {
        headers: withAuth(),
      },
    )
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to get upload URL')
    }
    const data = await response.json()
    return {
      url: data.url,
      fields: data.fields,
      fileUrl: data.fileUrl,
    }
  },

  async deleteFiles(fileUrls: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/storage/delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fileUrls }),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to delete files')
    }
  },

  async uploadFiles(
    files: FileList,
    onProgress: (progress: FileProgress) => void,
  ): Promise<Array<{ name: string; fileUrl: string }>> {
    const uploadedUrls = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Start with 0 progress
        onProgress({ name: file.name, progress: 0 })

        // Set up upload with correct content type
        const { url, fields, fileUrl } = await this.getUploadUrl({
          contentType: file.type || 'application/octet-stream',
        })

        const formData = new FormData()

        // Add all fields from the pre-signed URL first
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value)
        })

        // Add the file last
        formData.append('file', file)

        // For local storage, use the provided URL directly
        // For cloud storage (S3, GCP), use pre-signed URL
        const uploadUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

        // Upload with progress tracking
        await axios.post(uploadUrl, formData, {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || file.size),
            )
            onProgress({ name: file.name, progress: percentCompleted })
          },
        })

        uploadedUrls.push({
          name: file.name,
          fileUrl,
        })
      } catch (err) {
        console.error('Error uploading file:', err)
        throw new Error(`Failed to upload file: ${file.name}`)
      }
    }
    return uploadedUrls
  },

  async createMemory(payload: CreateMemoryPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: 'POST',
      headers: getHeaders(),
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
      headers: getHeaders(),
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

  async getMemory(id: string): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      headers: withAuth(),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to fetch memory')
    }
    const data = await response.json()
    return data
  },

  async getRandomMemories(userId: string): Promise<Memory[]> {
    const response = await fetch(
      `${API_BASE_URL}/memories/random?user_id=${userId}`,
      {
        headers: withAuth(),
      },
    )
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to fetch random memories')
    }
    const data = await response.json()
    return data.memories
  },

  async getAllMemories(
    userId: string,
    search: string = '',
    sort: string = 'timestamp',
    order: string = 'desc',
  ): Promise<Memory[]> {
    const response = await fetch(
      `${API_BASE_URL}/memories/all?user_id=${userId}&search=${search}&sort=${sort}&order=${order}`,
      {
        headers: withAuth(),
      },
    )
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to fetch all memories')
    }
    const data = await response.json()
    return data.memories
  },

  async getPublicMemory(public_id: string): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/public/${public_id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch public memory')
    }
    const data = await response.json()
    return data
  },

  async getPublicMemories(
    userId: string,
    search: string = '',
    sort: string = 'timestamp',
    order: string = 'desc',
  ): Promise<{ memories: Memory[]; user: User }> {
    const response = await fetch(
      `${API_BASE_URL}/memories/public/user/${userId}?search=${search}&sort=${sort}&order=${order}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch public memories')
    }
    const data = await response.json()
    return data
  },

  async sendEmail(
    email: string,
    title: string,
    description: string,
    url: string,
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/send-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, title, description, url }),
    })
    await handleUnauthorized(response)
    if (!response.ok) {
      throw new Error('Failed to send email')
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/request-reset`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    })
    if (!response.ok) {
      throw new Error('Failed to request password reset')
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token, newPassword }),
    })
    if (!response.ok) {
      throw new Error('Failed to reset password')
    }
  },
}
