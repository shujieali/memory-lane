import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Memory } from '../types/memory'
import type { User } from '../types/user'
import { api } from '../services/api'
import MemoryLane from '../features/memories/components/MemoryLane'
import StatusIndicator from '../components/StatusIndicator'
import Search from '../components/Search'
import Sort from '../components/Sort'
import { Typography, Stack } from '@mui/material'
import { ShareButton } from '../features/share'

/**
 * Page component for displaying a user's public memory lane
 * Uses the PublicMemoryLane feature component
 */
const PublicMemoryLanePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('timestamp')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (userId) {
          setLoading(true)
          setError('')
          const { memories: memoryData, user } = await api.getPublicMemories(
            userId,
            search,
            sort,
            order,
          )
          setUser(user)
          setMemories(memoryData)
        }
      } catch (err) {
        console.error('Error fetching public memories:', err)
        setError('Failed to load memories')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchDetails()
    } else {
      setError('Invalid Memory Lane Link')
    }
  }, [userId, search, sort, order])

  if (!userId) {
    return <StatusIndicator error={error} loading={loading} />
  }

  return (
    <>
      <Typography variant='h5' align='left' gutterBottom sx={{ px: 2 }}>
        {user?.name?.split(' ')[0]}&apos;s Memory Lane
      </Typography>
      <Stack
        direction='row'
        spacing={2}
        sx={{
          mt: 2,
          mb: 3,
          px: 2,
          justifyContent: 'center',
          alignItems: 'baseline',
        }}
      >
        <Search
          search={search}
          onSearchChange={(e) => setSearch(e.target.value)}
        />
        <Sort
          sort={sort}
          order={order}
          onSortChange={(e) => setSort(e.target.value)}
          onOrderChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
        />
        <ShareButton
          title={`${user?.name}'s Memory Lane`}
          description={`Explore ${user?.name}'s memories on Memory Lane`}
          url={window.location.href}
        />
      </Stack>

      <MemoryLane
        memories={memories}
        loading={loading}
        error={error}
        isPublic={true}
      />
    </>
  )
}

export default PublicMemoryLanePage
