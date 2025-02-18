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
import { FileData } from '../../../../components/ImageUploader/types'

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
  const [files, setFiles] = useState<FileData[]>([])
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

  // Handle field changes and clear specific errors
  const handleFieldChange = (
    field: keyof MemoryFormState,
    value: string | string[],
  ) => {
    setMemoryForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Only clear errors for fields that can have errors
    if (field === 'title' || field === 'description') {
      if (formErrors[field]) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }
  }

  // Clear image error when files are added/removed
  useEffect(() => {
    if (formErrors.image_urls && files.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        image_urls: undefined,
      }))
    }
  }, [files, formErrors.image_urls])

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

    if (files.some((file) => file.progress < 100)) {
      errors.image_urls = 'Images are still uploading'
      isValid = false
    }
    if (files.length === 0) {
      errors.image_urls = 'At least one image is required'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const title = memoryForm.title?.trim()
    const description = memoryForm.description?.trim()

    if (!title || !description) {
      setFormErrors({
        ...formErrors,
        title: !title ? 'Title is required' : undefined,
        description: !description ? 'Description is required' : undefined,
      })
      return
    }

    setSaveProgress({ saving: true, progress: 0 })
    const progressInterval = window.setInterval(() => {
      setSaveProgress((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }))
    }, 200)

    try {
      const currentUrls = files.map((file) => file.url)
      const memoryData = {
        title,
        description,
        tags: memoryForm.tags || [],
        image_urls: currentUrls,
        timestamp: memoryForm.timestamp || new Date().toISOString(),
      }

      if (memory?.id) {
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
            hasError={!!formErrors.image_urls}
            onUploadStatusChange={setIsUploading}
          />
          <MemoryForm
            memoryForm={memoryForm}
            onFieldChange={handleFieldChange}
            formErrors={formErrors}
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
