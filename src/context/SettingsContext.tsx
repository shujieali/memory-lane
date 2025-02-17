import { useEffect, useState, ReactNode } from 'react'
import { AppSettings, defaultSettings } from './types'
import { deepMerge, DeepPartial } from '../utils/deepMerge'
import { loadSettings, saveSettings } from './settingsUtils'
import { SettingsContext } from './contexts'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = (newSettings: DeepPartial<AppSettings>) => {
    setSettings((current) => deepMerge(current, newSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
