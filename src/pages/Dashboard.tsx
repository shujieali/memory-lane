import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
  Fab,
  Zoom,
  styled,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useAuth } from '../hooks'
import { useSettings } from '../hooks'
import { api } from '../services/api'
import MemoryCard from '../features/memories/components/MemoryCard'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import SearchBar from '../components/Search'
import SortHandler from '../components/Sort'
import { AddMemoryDialog } from '../features/memories'
import { Memory } from '../types/memory'
import { SelectChangeEvent } from '@mui/material/Select'

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  width: 56,
  minWidth: 56,
  borderRadius: 28,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiSvgIcon-root': {
    transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    width: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    borderRadius: 16,
    justifyContent: 'flex-start',
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
    },
  },
}))

const FabText = styled('span')({
  opacity: 0,
  transform: 'translateX(-8px)',
  display: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '.MuiFab-root:hover &': {
    display: 'block',
    opacity: 1,
    transform: 'translateX(0)',
  },
})

export default function Dashboard() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMemoryModal, setOpenMemoryModal] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [deleteMemory, setDeleteMemory] = useState<Memory | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('timestamp')
  const [order, setOrder] = useState('desc')

  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getAllMemories(user?.id || '', search, sort, order)
      setMemories(data)
    } catch (err) {
      setError('Failed to load memories')
      console.error('Error fetching memories:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id, search, sort, order])

  useEffect(() => {
    if (user?.id) {
      fetchMemories()
    }
  }, [user?.id, search, sort, order, fetchMemories])

  const handleOpenDialog = (memory?: Memory) => {
    setEditingMemory(memory || null)
    setOpenMemoryModal(true)
  }

  const handleCloseDialog = () => {
    setOpenMemoryModal(false)
    setEditingMemory(null)
  }

  const handleSaveSuccess = () => {
    fetchMemories()
  }

  const handleDeleteClick = (memory: Memory) => {
    setDeleteMemory(memory)
  }

  const handleConfirmDelete = async () => {
    if (deleteMemory) {
      try {
        await api.deleteMemory(deleteMemory.id)
        setMemories(memories.filter((memory) => memory.id !== deleteMemory.id))
        setDeleteMemory(null)
      } catch (err) {
        console.error('Error deleting memory:', err)
        setError('Failed to delete memory')
      }
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value as string)
  }

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setOrder(event.target.value as string)
  }

  return (
    <Container maxWidth='xl'>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant='h4'>Welcome, {user?.name || 'User'}!</Typography>
        </Box>

        <Box
          sx={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            gap: 2,
            borderRadius: 1,
            flexGrow: 1,
          }}
        >
          <SearchBar search={search} onSearchChange={handleSearchChange} />
          <SortHandler
            sort={sort}
            order={order}
            onSortChange={handleSortChange}
            onOrderChange={handleOrderChange}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography>Loading memories...</Typography>
          </Box>
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
            <Button
              variant='contained'
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
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
            <Typography color='text.secondary' paragraph>
              Click the &quot;Add Memory&quot; button to create your first
              memory!
            </Typography>
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Memory
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3} columns={12}>
            {memories.map((memory) => (
              <Grid
                item
                xs={12}
                sm={settings.display.cardsPerRow === 2 ? 6 : 4}
                md={12 / settings.display.cardsPerRow}
                key={memory.id}
                sx={{
                  display: 'flex',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <MemoryCard
                    {...memory}
                    onEdit={() => handleOpenDialog(memory)}
                    onDelete={() => handleDeleteClick(memory)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <AddMemoryDialog
          open={openMemoryModal}
          memory={editingMemory}
          onClose={handleCloseDialog}
          onSave={handleSaveSuccess}
        />

        <DeleteConfirmDialog
          open={!!deleteMemory}
          title={deleteMemory?.title || ''}
          onClose={() => setDeleteMemory(null)}
          onConfirm={handleConfirmDelete}
        />

        <Zoom in={!openMemoryModal}>
          <StyledFab
            color='primary'
            onClick={() => handleOpenDialog()}
            aria-label='add memory'
          >
            <Add />
            <FabText>Add Memory</FabText>
          </StyledFab>
        </Zoom>
      </Box>
    </Container>
  )
}
