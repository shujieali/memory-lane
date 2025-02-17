export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
}

export interface FileProgress {
  name: string
  progress: number
}

export interface CreateMemoryPayload {
  user_id: string
  title: string
  description: string
  image_urls: string[]
  timestamp: string
}

export interface UpdateMemoryPayload {
  title: string
  description: string
  image_urls: string[]
  timestamp: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}
