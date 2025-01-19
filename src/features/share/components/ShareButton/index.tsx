import { Button } from '@mui/material'
import { Share } from '@mui/icons-material'
import { useShareMemory } from '../../../../hooks/useShare'
import React from 'react'
interface ShareButtonProps {
  title: string
  description: string
  url: string
  children?: React.ReactNode
}

export default function ShareButton({
  title,
  description,
  url,
  children,
}: ShareButtonProps) {
  const { shareMemory } = useShareMemory()
  const handleShare = () => {
    shareMemory({
      title,
      description,
      url,
    })
  }
  return (
    <Button
      variant='text'
      aria-label='share'
      startIcon={<Share />}
      onClick={handleShare}
      size='small'
      sx={{ ml: 'auto' }}
    >
      {children}
    </Button>
  )
}
