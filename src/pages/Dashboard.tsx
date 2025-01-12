import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material'
import { Add, LocalOffer } from '@mui/icons-material'
import { useAuth } from '../hooks'
import { useSettings } from '../hooks'
import { useState, useEffect, KeyboardEvent } from 'react'
import { api } from '../services/api'
import MemoryCard from '../components/MemoryCard'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import { getRandomImage, ImageCategory } from '../utils/imageUtils'

import { Memory, MemoryFormErrors } from '../types/memory'

const emptyMemory = {
  title: '',
  description: '',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [memoryForm, setMemoryForm] = useState(emptyMemory)
  const [selectedCategory, setSelectedCategory] =
    useState<ImageCategory>('nature')
  const [formErrors, setFormErrors] = useState<MemoryFormErrors>({})
  const [deleteMemory, setDeleteMemory] = useState<Memory | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleOpenDialog = (memory?: Memory) => {
    if (memory) {
      setEditingMemory(memory)
      setMemoryForm({
        title: memory.title,
        description: memory.description,
      })
      setTags(memory.tags || [])
    } else {
      setEditingMemory(null)
      setMemoryForm(emptyMemory)
      setSelectedCategory('nature')
      setTags([])
    }
    setFormErrors({})
    setOpenDialog(true)
  }

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMemory(null)
    setMemoryForm(emptyMemory)
    setFormErrors({})
    setTags([])
    setTagInput('')
  }

  const validateForm = (): boolean => {
    const errors: MemoryFormErrors = {}
    let isValid = true

    if (!memoryForm.title.trim()) {
      errors.title = 'Title is required'
      isValid = false
    }

    if (!memoryForm.description.trim()) {
      errors.description = 'Description is required'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getMemories(user?.id || '')
        setMemories(data)
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

  const handleSaveMemory = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const imageUrl = getRandomImage(selectedCategory)
      const timestamp = new Date().toISOString()

      const memoryData = {
        ...memoryForm,
        image_url: imageUrl,
        timestamp,
        tags,
      }

      if (editingMemory) {
        // Update existing memory
        await api.updateMemory(editingMemory.id, memoryData)

        setMemories(
          memories.map((memory) =>
            memory.id === editingMemory.id
              ? {
                  ...memory,
                  ...memoryForm,
                  image_url: imageUrl,
                  timestamp,
                  tags,
                }
              : memory,
          ),
        )
      } else {
        // Add new memory
        await api.createMemory({
          user_id: user?.id || '',
          ...memoryData,
        })

        const data = await api.getMemories(user?.id || '')
        setMemories(data)
      }
      handleCloseDialog()
    } catch (err) {
      console.error('Error saving memory:', err)
      setError('Failed to save memory')
    }
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
          <Box>
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Memory
            </Button>
          </Box>
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

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>
            {editingMemory ? 'Edit Memory' : 'Add New Memory'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Title'
              fullWidth
              value={memoryForm.title}
              onChange={(e) =>
                setMemoryForm({ ...memoryForm, title: e.target.value })
              }
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            <TextField
              margin='dense'
              label='Description'
              fullWidth
              multiline
              rows={4}
              value={memoryForm.description}
              onChange={(e) =>
                setMemoryForm({ ...memoryForm, description: e.target.value })
              }
              error={!!formErrors.description}
              helperText={formErrors.description}
              required
            />
            <FormControl fullWidth margin='dense'>
              <InputLabel>Image Category</InputLabel>
              <Select
                value={selectedCategory}
                label='Image Category'
                onChange={(e) =>
                  setSelectedCategory(e.target.value as ImageCategory)
                }
              >
                <MenuItem value='nature'>Nature</MenuItem>
                <MenuItem value='city'>City</MenuItem>
                <MenuItem value='people'>People</MenuItem>
                <MenuItem value='food'>Food</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label='Add Tags'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                helperText='Press Enter to add a tag'
              />
              {tags.length > 0 && (
                <Stack
                  direction='row'
                  spacing={1}
                  sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}
                >
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      icon={<LocalOffer />}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveMemory} variant='contained'>
              {editingMemory ? 'Save Changes' : 'Add Memory'}
            </Button>
          </DialogActions>
        </Dialog>

        <DeleteConfirmDialog
          open={!!deleteMemory}
          title={deleteMemory?.title || ''}
          onClose={() => setDeleteMemory(null)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </Container>
  )
}
