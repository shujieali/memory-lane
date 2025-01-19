import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { useAuth } from '../hooks'
import { api } from '../services/api'
import Search from '../components/Search'
import Sort from '../components/Sort'
import { ShareButton } from '../features/share'
import { Memory } from '../types/memory'
import MemoryLane from '../features/memories/components/MemoryLane'

export default function Memories() {
  const { user } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('timestamp')
  const [order, setOrder] = useState('desc')

  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getMemories(
        user?.id || '',
        page,
        search,
        sort,
        order,
      )
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setMemories((prev) => {
          const newMemories = data.filter(
            (memory) => !prev.some((m) => m.id === memory.id),
          )
          return [...prev, ...newMemories]
        })
        if (data.length < 10) {
          setHasMore(false)
        }
      }
    } catch (err) {
      setError('Failed to load memories')
      console.error('Error fetching memories:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id, page, search, sort, order])

  useEffect(() => {
    if (user?.id) {
      fetchMemories()
    }
  }, [user?.id, fetchMemories, page, search, sort, order])

  const debouncedScrollHandler = debounce(
    () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop
      const threshold = document.documentElement.offsetHeight * 0.8
      if (scrollPosition < threshold || loading || !hasMore) {
        return
      }
      setPage((prevPage) => prevPage + 1)
    },
    200,
    { leading: false, trailing: true },
  )

  // Wrap the debounced function in a stable callback
  const handleScroll = useCallback(() => {
    debouncedScrollHandler()
  }, [debouncedScrollHandler])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(1)
    setMemories([])
    setHasMore(true)
  }

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value as string)
    setPage(1)
    setMemories([])
    setHasMore(true)
  }

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setOrder(event.target.value as string)
    setPage(1)
    setMemories([])
    setHasMore(true)
  }

  if (error) {
    return (
      <Container maxWidth='md'>
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            {user?.name}&apos;s Memory Lane
          </Typography>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='error'>{error}</Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container
      data-scroll-container
      maxWidth='xl'
      sx={{
        overflowY: 'auto',
        height: `calc(100vh - 75px)`,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'baseline',
            mb: 3,
          }}
        >
          <Search search={search} onSearchChange={handleSearchChange} />
          <Sort
            sort={sort}
            order={order}
            onSortChange={handleSortChange}
            onOrderChange={handleOrderChange}
          />
          <ShareButton
            title={`${user?.name}'s Memory Lane`}
            description='Check out my Memory Lane!'
            url={`${import.meta.env.VITE_API_BASE_URL}/social/lane/${user?.id}`}
          >
            Share
          </ShareButton>
        </Box>

        <MemoryLane memories={memories} loading={loading} error={error || ''} />
        {loading && <CircularProgress />}
        {!hasMore && (
          <Typography variant='body2' color='text.secondary' align='center'>
            No more memories to load
          </Typography>
        )}
      </Box>
    </Container>
  )
}
