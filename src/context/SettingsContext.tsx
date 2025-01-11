import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  AppSettings,
  SettingsContextType,
  defaultSettings,
} from '../types/settings'
import { deepMerge, DeepPartial } from '../utils/deepMerge'

const SETTINGS_STORAGE_KEY = 'app_settings'

const SettingsContext = createContext<SettingsContextType | null>(null)

function loadSettings(): AppSettings {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      return deepMerge(defaultSettings, JSON.parse(savedSettings))
    }
  } catch (error) {
    // Use template literal for proper string formatting
    console.error(`Failed to load settings: ${error}`)
  }
  return defaultSettings
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error(`Failed to save settings: ${error}`)
  }
}

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

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
