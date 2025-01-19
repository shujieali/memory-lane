import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Helmet } from 'react-helmet'
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
    <Fragment>
      <Helmet>
        <title>{`${user?.name}'s Memory`}</title>
        <meta name='title' content={memory.title} />
        <meta name='description' content={memory.description} />
        <meta name='image' content={memory.image_urls[0]} />
        <meta name='url' content={window.location.href} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Memory Lane' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:locale:alternate' content='en_US' />
        <meta property='og:type' content='article' />
        <meta property='og:title' content={memory.title} />
        <meta property='og:description' content={memory.description} />
        <meta property='og:image' content={memory.image_urls[0]} />
        <meta property='og:url' content={window.location.href} />
      </Helmet>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <MemoryCardPreview memory={memory} />
      </Box>
    </Fragment>
  )
}
