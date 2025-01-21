import React from 'react'
import { Box } from '@mui/material'
import { Timeline } from '@mui/lab'
import type { Memory } from '../../../../types/memory'
import { useScrollDetection } from '../../../../hooks'
import { StatusIndicator, ScrollIndicator } from '../../../../components'
import TimelineItem from '../TimelineItem'
import { MemoryLaneProps } from './types'

/**
 * Displays a chronological timeline of public memories for a user
 * with a scrolling date indicator
 */

const MemoryLane: React.FC<MemoryLaneProps> = ({
  memories,
  loading,
  error,
  isPublic = false,
}) => {
  // Use our custom scroll detection hook for animation
  const { showIndicator, currentItem, containerRef } =
    useScrollDetection<Memory>(memories, {
      hideDelay: 1500,
      scrollDebounce: 100,
    })

  if (loading || error || !memories.length) {
    return (
      <StatusIndicator
        loading={loading}
        error={error}
        emptyMessage='No memories found'
      />
    )
  }

  const currentDate = currentItem
    ? new Date(currentItem.timestamp).toLocaleDateString('default', {
        year: 'numeric',
        month: 'short',
      })
    : ''
  const scrollContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end', // Push to the right
    alignItems: 'center', // Center vertically
    height: '100vh', // Full viewport height
  }

  return (
    <>
      <Box ref={containerRef}>
        <Timeline position='alternate' sx={{ maxWidth: 1200, mx: 'auto' }}>
          {memories.map((memory) => (
            <TimelineItem key={memory.id} memory={memory} isPublic={isPublic} />
          ))}
        </Timeline>
      </Box>

      <ScrollIndicator
        text={currentDate}
        show={showIndicator}
        containerStyle={scrollContainerStyle}
      />
    </>
  )
}

export default React.memo(MemoryLane)
