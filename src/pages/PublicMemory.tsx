import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { Helmet } from 'react-helmet'
import { Memory } from '../types/memory'
import { api } from '../services/api'
import { MemoryCardPreview } from '../features/memories'
import StatusIndicator from '../components/StatusIndicator'

export default function PublicMemory() {
  const navigate = useNavigate()
  const location = useLocation()
  const { public_id } = useParams<{ public_id: string }>()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const isInternalNavigation = location.state?.from

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const data = await api.getPublicMemory(public_id || '')
        setMemory(data)
      } catch (error) {
        console.error('Failed to fetch memory:', error)
      } finally {
        setLoading(false)
      }
    }

    if (public_id) {
      fetchMemory()
    }
  }, [public_id])

  if (loading || !memory) {
    return <StatusIndicator loading={loading} error={'Invalid Memory Link'} />
  }

  return (
    <Fragment>
      <Helmet>
        <title>{`Memory: ${memory.title}`}</title>
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
      {isInternalNavigation && (
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
      )}

      <MemoryCardPreview memory={memory} isDetailView={true} />
    </Fragment>
  )
}
