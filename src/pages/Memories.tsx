import { Box, Container, Typography, Paper } from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks'
import { api } from '../services/api'
import MemoryCardPreview from '../components/MemoryCardPreview'
import { Memory } from '../types/memory'

export default function Memories() {
  const { user } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getMemories(user?.id || '')
        // Sort memories by date, newest first
        const sorted = data.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        setMemories(sorted)
      } catch (err) {
        setError('Failed to load memories')
        console.error('Error fetching memories:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchMemories()
    }
  }, [user?.id])

  if (loading) {
    return (
      <Container maxWidth='md'>
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Your Memory Timeline
          </Typography>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Loading memories...</Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth='md'>
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Your Memory Timeline
          </Typography>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='error'>{error}</Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  if (memories.length === 0) {
    return (
      <Container maxWidth='md'>
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Your Memory Timeline
          </Typography>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              No memories yet
            </Typography>
            <Typography color='text.secondary'>
              Your memories will appear here chronologically once you start
              creating them.
            </Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='md'>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          Your Memory Timeline
        </Typography>
        <Timeline position='alternate'>
          {memories.map((memory) => (
            <TimelineItem key={memory.id}>
              <TimelineOppositeContent color='text.secondary'>
                {new Date(memory.timestamp).toLocaleDateString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                  <MemoryCardPreview {...memory} />
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Container>
  )
}
