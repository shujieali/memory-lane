import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from '../hooks'
import { Memory } from '../types/memory'
import { api } from '../services/api'
import { MemoryCardPreview } from '../features/memories'
import { StatusIndicator } from '../components'

export default function MemoryDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const data = await api.getMemory(id || '')
        setMemory(data)
      } catch (error) {
        console.error('Failed to fetch memory:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id && user?.id) {
      fetchMemory()
    }
  }, [id, user?.id])

  if (loading || !memory) {
    return <StatusIndicator loading={loading} />
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <MemoryCardPreview memory={memory} />
    </Box>
  )
}
