import { SxProps, Theme } from '@mui/material'

export interface StatusIndicatorProps {
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean

  /**
   * Error message to display
   */
  error?: string | null

  /**
   * Message to show when no content is available
   */
  emptyMessage?: string

  /**
   * Additional styles for the container
   */
  sx?: SxProps<Theme>
}
