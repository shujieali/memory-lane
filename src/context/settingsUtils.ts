import { AppSettings, defaultSettings } from './types'
import { deepMerge, DeepPartial } from '../utils/deepMerge'

export const SETTINGS_STORAGE_KEY = 'app_settings'

export function loadSettings(): AppSettings {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      const parsedSettings = JSON.parse(
        savedSettings,
      ) as DeepPartial<AppSettings>
      return deepMerge(defaultSettings, parsedSettings)
    }
  } catch (error) {
    console.error(`Failed to load settings: ${error}`)
  }
  return defaultSettings
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error(`Failed to save settings: ${error}`)
  }
}

export function clearSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    // Reload the page to apply the changes
    window.location.reload()
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Failed to clear settings: ${err.message}`)
    }
  }
}
