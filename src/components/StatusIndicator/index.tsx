import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import type { StatusIndicatorProps } from './types'

/**
 * A reusable component for displaying loading, error, and empty states
 *
 * @example
 * ```tsx
 * <StatusIndicator
 *   loading={isLoading}
 *   error={error}
 *   emptyMessage="No items found"
 * />
 * ```
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  loading,
  error,
  emptyMessage = 'No content available',
  sx = {},
}) => {
  const commonStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    ...sx,
  }

  if (loading) {
    return (
      <Box sx={commonStyles}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={commonStyles}>
        <Typography color='error'>{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={commonStyles}>
      <Typography color='text.secondary'>{emptyMessage}</Typography>
    </Box>
  )
}

export default StatusIndicator
export type { StatusIndicatorProps }
