import { createTheme } from '@mui/material'
import { getPalette } from './palette'
import { components } from './components'
import { typography } from './typography'

export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = getPalette(mode)
  return createTheme({
    palette,
    components,
    typography,
  })
}
