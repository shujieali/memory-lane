import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

interface FadeTransitionProps {
  children: ReactNode
}

export default function FadeTransition({ children }: FadeTransitionProps) {
  const location = useLocation()

  return (
    <Box
      sx={{
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
      key={location.pathname}
    >
      {children}
    </Box>
  )
}
