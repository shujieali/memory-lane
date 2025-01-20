import { useState, KeyboardEvent } from 'react'
import { TextField, Box, Chip, Stack } from '@mui/material'
import LocalOffer from '@mui/icons-material/LocalOffer'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { MemoryFormErrors, MemoryFormState } from '../../../../types/memory'

interface MemoryFormFieldsProps {
  memoryForm: MemoryFormState
  setMemoryForm: (memory: MemoryFormState) => void
  formErrors: MemoryFormErrors
  setFormErrors: (errors: MemoryFormErrors) => void
}

const MemoryFormFields = ({
  memoryForm,
  setMemoryForm,
  formErrors,
}: MemoryFormFieldsProps) => {
  const [tagInput, setTagInput] = useState('')
  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!memoryForm.tags?.includes(tagInput.trim())) {
        setMemoryForm({
          ...memoryForm,
          tags: [...(memoryForm.tags || []), tagInput.trim()],
        })
      }
      setTagInput('')
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    setMemoryForm({
      ...memoryForm,
      tags: memoryForm.tags?.filter((tag) => tag !== tagToDelete),
    })
  }

  return (
    <Box sx={{ pl: 2, height: '100%', width: '30%' }}>
      <TextField
        autoFocus
        margin='dense'
        label='Title'
        fullWidth
        value={memoryForm.title || ''}
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
        value={memoryForm.description || ''}
        onChange={(e) =>
          setMemoryForm({ ...memoryForm, description: e.target.value })
        }
        error={!!formErrors.description}
        helperText={formErrors.description}
        required
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label='Memory Date & Time'
          value={memoryForm.timestamp ? dayjs(memoryForm.timestamp) : dayjs()}
          onChange={(date) => {
            if (date) {
              setMemoryForm({
                ...memoryForm,
                timestamp: date.toISOString(),
              })
            }
          }}
          sx={{ mt: 2, width: '100%' }}
        />
      </LocalizationProvider>
      <Box sx={{ mt: 2, maxWidth: 400 }}>
        <TextField
          fullWidth
          label='Add Tags'
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          helperText='Press Enter to add a tag'
        />
        {memoryForm.tags && memoryForm.tags.length > 0 && (
          <Stack
            direction='row'
            spacing={1}
            sx={{
              mt: 1,
              flexWrap: 'wrap',
              gap: 1,
              overflow: 'auto',
              maxHeight: 100,
            }}
          >
            {memoryForm.tags.map((tag) => (
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
    </Box>
  )
}

export default MemoryFormFields
