import React from 'react'
import { Fade, Typography, Box, useTheme } from '@mui/material'
import type { ScrollIndicatorProps } from './types'

/**
 * A floating indicator that appears during scrolling
 * Used to show current position/progress in a scrollable content
 *
 * @example
 * ```tsx
 * <ScrollIndicator
 *   text="Current Section"
 *   show={isVisible}
 * />
 * ```
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  text,
  show,
  containerStyle,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: theme.zIndex.tooltip,
        ...containerStyle,
      }}
    >
      <Fade
        in={show}
        timeout={{
          enter: 200,
          exit: 500,
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'regular',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            px: 3,
            py: 2,
            borderRadius: 3,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
            textAlign: 'center',
            transform: show ? 'scale(1)' : 'scale(0.9)',
            transition: theme.transitions.create(['transform', 'opacity'], {
              duration: 200,
            }),
            userSelect: 'none',
          }}
        >
          {text}
        </Typography>
      </Fade>
    </Box>
  )
}

export type { ScrollIndicatorProps }
export default ScrollIndicator
