import { DeepPartial } from '../utils/deepMerge'

export type ThemeMode = 'light' | 'dark'

export interface AppSettings {
  theme: {
    mode: ThemeMode
    compactView: boolean
    drawerOpen: boolean
  }
  display: {
    showDates: boolean
    showTags: boolean
    cardsPerRow: 2 | 3 | 4
  }
  notifications: {
    enabled: boolean
    emailNotifications: boolean
  }
}

export interface SettingsContextType {
  settings: AppSettings
  updateSettings: (newSettings: DeepPartial<AppSettings>) => void
  resetSettings: () => void
}

export const defaultSettings: AppSettings = {
  theme: {
    mode: 'light',
    compactView: false,
    drawerOpen: true,
  },
  display: {
    showDates: true,
    showTags: true,
    cardsPerRow: 3,
  },
  notifications: {
    enabled: true,
    emailNotifications: false,
  },
}
