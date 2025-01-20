import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Box,
  LinearProgress,
} from '@mui/material'
import {
  Memory,
  MemoryFormErrors,
  MemoryFormState,
} from '../../../../types/memory'
import { api } from '../../../../services/api'
import { useAuth } from '../../../../hooks/useAuth'
import MemoryForm from '../AddMemoryForm'
import ImageUploader from '../../../../components/ImageUploader'

interface MemoryDialogProps {
  open: boolean
  memory?: Memory | null
  onClose: () => void
  onSave: () => void
}

const emptyMemory: MemoryFormState = {
  title: '',
  description: '',
  tags: [],
  image_urls: [],
  timestamp: new Date().toISOString(),
}

interface SaveProgress {
  saving: boolean
  progress: number
}

export default function MemoryDialog({
  open,
  memory,
  onClose,
  onSave,
}: MemoryDialogProps) {
  const { user } = useAuth()
  const [memoryForm, setMemoryForm] = useState<MemoryFormState>(emptyMemory)
  const [formErrors, setFormErrors] = useState<MemoryFormErrors>({})
  const [files, setFiles] = useState<
    { name: string; progress: number; url: string }[]
  >([])
  const [isUploading, setIsUploading] = useState(false)
  const [saveProgress, setSaveProgress] = useState<SaveProgress>({
    saving: false,
    progress: 0,
  })

  // Track original files for cleanup on update/cancel
  const [originalFiles, setOriginalFiles] = useState<string[]>([])

  useEffect(() => {
    if (memory) {
      setMemoryForm({
        title: memory.title,
        description: memory.description,
        tags: memory.tags || [],
        image_urls: memory.image_urls || [],
        timestamp: memory.timestamp,
      })
      setFiles(
        memory.image_urls?.map((url) => ({
          name: memory.title,
          url,
          progress: 100,
        })) || [],
      )
      setOriginalFiles(memory.image_urls || [])
    } else {
      setMemoryForm(emptyMemory)
      setFiles([])
      setOriginalFiles([])
    }
    setSaveProgress({ saving: false, progress: 0 })
    setFormErrors({})
  }, [memory, open])

  // Cleanup files on dialog close without saving
  const handleClose = async () => {
    // Get current files that weren't in the original set
    const filesToDelete = files
      .map((file) => file.url)
      .filter((url) => !originalFiles.includes(url))

    if (filesToDelete.length > 0) {
      try {
        await api.deleteFiles(filesToDelete)
      } catch (error) {
        console.error('Error cleaning up files:', error)
      }
    }
    onClose()
  }

  const validateForm = (): boolean => {
    const errors: MemoryFormErrors = {}
    let isValid = true

    if (!memoryForm.title?.trim()) {
      errors.title = 'Title is required'
      isValid = false
    }

    if (!memoryForm.description?.trim()) {
      errors.description = 'Description is required'
      isValid = false
    }

    if (files?.every((file) => file.progress < 100)) {
      errors.image_urls = 'Images are still uploading'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSaveMemory = async () => {
    setSaveProgress({ saving: true, progress: 0 })
    if (!validateForm()) {
      return
    }

    const timestamp = memoryForm.timestamp || new Date().toISOString()
    const progressInterval = window.setInterval(() => {
      setSaveProgress((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }))
    }, 200)

    try {
      const currentUrls = files.map((file) => file.url)
      const memoryData = {
        title: memoryForm.title || '',
        description: memoryForm.description || '',
        tags: memoryForm.tags || [],
        image_urls: currentUrls,
        timestamp,
      }

      if (memory) {
        // Update existing memory
        await api.updateMemory(memory.id, memoryData)

        // Clean up removed files after successful update
        const removedFiles = originalFiles.filter(
          (url) => !currentUrls.includes(url),
        )
        if (removedFiles.length > 0) {
          await api.deleteFiles(removedFiles)
        }
      } else {
        // Add new memory
        await api.createMemory({
          user_id: user?.id || '',
          ...memoryData,
        })
      }

      setSaveProgress({ saving: true, progress: 100 })
      onSave()
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Error saving memory:', error)
      setFormErrors({
        title: 'Failed to save memory. Please try again.',
      })
      setSaveProgress({ saving: false, progress: 0 })
    } finally {
      window.clearInterval(progressInterval)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
      <DialogTitle>{memory ? 'Edit Memory' : 'Add New Memory'}</DialogTitle>
      <DialogContent sx={{ height: '60vh' }}>
        <Container
          maxWidth='xl'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <ImageUploader
            files={files}
            setFiles={setFiles}
            onUploadStatusChange={setIsUploading}
          />
          <MemoryForm
            memoryForm={memoryForm}
            setMemoryForm={setMemoryForm}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </Container>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={handleSaveMemory}
            variant='contained'
            disabled={isUploading || saveProgress.saving}
          >
            {saveProgress.saving
              ? `Saving ${saveProgress.progress}%`
              : memory
                ? 'Save Changes'
                : 'Add Memory'}
          </Button>
          {saveProgress.saving && (
            <LinearProgress
              variant='determinate'
              value={saveProgress.progress}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}
