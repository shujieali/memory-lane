import { useContext } from 'react'
import { ShareMemoryContext } from '../context/contexts'

export function useShareMemory() {
  const context = useContext(ShareMemoryContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
