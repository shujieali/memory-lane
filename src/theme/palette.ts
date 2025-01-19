import { PaletteMode } from '@mui/material'

// Common colors shared between light and dark themes
const commonColors = {
  error: {
    main: '#FF5252',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    contrastText: '#FFFFFF',
  },
}

// Light and dark mode-specific palettes
const lightPalette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
}

const darkPalette = {
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
}

// Function to generate the palette based on the mode
export const getPalette = (mode: PaletteMode) => ({
  mode,
  ...(mode === 'light' ? lightPalette : darkPalette),
  ...commonColors,
})
