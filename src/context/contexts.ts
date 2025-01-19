import { createContext } from 'react'
import { AuthContextType } from '../services/types'
import { SettingsContextType, ShareMemoryContextType } from './types'

export const AuthContext = createContext<AuthContextType | null>(null)
export const SettingsContext = createContext<SettingsContextType | null>(null)
export const ShareMemoryContext = createContext<ShareMemoryContextType | null>(
  null,
)
