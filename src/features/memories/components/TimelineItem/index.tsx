import React from 'react'
import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab'
import { Box, useTheme } from '@mui/material'
import { MemoryTimelineItemProps } from './types'
import MemoryCard from '../MemoryCard'

/**
 * A single item in the memory timeline
 * Displays a memory card with date and timeline decorations
 */
const MemoryTimelineItem: React.FC<MemoryTimelineItemProps> = ({
  memory,
  isPublic = false,
}) => {
  const theme = useTheme()

  return (
    <TimelineItem>
      <TimelineOppositeContent color='text.secondary'>
        {new Date(memory.timestamp).toLocaleDateString()}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          color='primary'
          sx={{
            transition: theme.transitions.create(['transform', 'box-shadow']),
            '.MuiTimelineItem-root:hover &': {
              transform: 'scale(1.2)',
              boxShadow: theme.shadows[4],
            },
          }}
        />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            transform: 'translateY(0)',
            transition: theme.transitions.create(['transform', 'box-shadow'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <MemoryCard {...memory} isPublic={isPublic} />
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}

export default MemoryTimelineItem
