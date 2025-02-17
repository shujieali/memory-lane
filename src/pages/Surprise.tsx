import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Fade,
} from '@mui/material'
import { Masonry } from '@mui/lab'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks'
import { api } from '../services/api'
import MemoryCard from '../features/memories/components/MemoryCard'
import { Memory } from '../types/memory'

export default function Surprise() {
  const { user } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRandomMemories = async () => {
      try {
        setLoading(true)
        setError(null)
        const randomMemories = await api.getRandomMemories(user?.id || '')
        setMemories(randomMemories)
      } catch (err) {
        setError('Failed to load memories')
        console.error('Error fetching memories:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchRandomMemories()
    }
  }, [user?.id])

  return (
    <Container maxWidth='xl'>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant='h4' gutterBottom>
            Memory Surprise
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Rediscover random moments from your journey...
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={300 * (index + 1)}>
                  <Paper sx={{ p: 2 }}>
                    <Skeleton variant='rectangular' height={200} />
                    <Box sx={{ pt: 2 }}>
                      <Skeleton />
                      <Skeleton width='60%' />
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography color='error' gutterBottom>
              {error}
            </Typography>
          </Paper>
        ) : memories.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant='h6' color='text.secondary' gutterBottom>
              No memories yet
            </Typography>
            <Typography color='text.secondary'>
              Start creating memories to see them here!
            </Typography>
          </Paper>
        ) : (
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
            {memories.map((memory, index) => (
              <Fade in timeout={300 * (index + 1)} key={memory.id}>
                <Box>
                  <MemoryCard {...memory} />
                </Box>
              </Fade>
            ))}
          </Masonry>
        )}
      </Box>
    </Container>
  )
}
