import { createContext } from 'react'
import { AuthContextType } from '../types/auth'
import { SettingsContextType } from '../types/settings'

export const AuthContext = createContext<AuthContextType | null>(null)
export const SettingsContext = createContext<SettingsContextType | null>(null)
