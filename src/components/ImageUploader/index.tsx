import { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import { Delete, AddPhotoAlternate } from '@mui/icons-material'
import { api } from '../../services/api'
import FileUploadArea from '../UploadArea'
import { ImageUploaderProps } from './types'

const ImageUploader = ({
  files,
  setFiles,
  hasError,
  onUploadStatusChange,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [deletedFiles, setDeletedFiles] = useState<string[]>([])

  useEffect(() => {
    onUploadStatusChange?.(isUploading)
  }, [isUploading, onUploadStatusChange])

  useEffect(() => {
    // Check if any files are still uploading
    const hasUploadingFiles = files.some((file) => file.progress < 100)
    setIsUploading(hasUploadingFiles)
  }, [files])

  // Cleanup on unmount - delete any files that were uploaded but not saved
  // and revoke any remaining blob URLs
  useEffect(() => {
    return () => {
      // Cleanup blob URLs
      files.forEach((file) => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })

      // Delete uploaded files that weren't saved
      if (deletedFiles.length > 0) {
        api.deleteFiles(deletedFiles).catch(console.error)
        setDeletedFiles([])
      }
    }
  }, [deletedFiles, files])

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'error' | 'warning' | 'info' | 'success'
  }>({
    open: false,
    message: '',
    severity: 'warning',
  })

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const updateFileProgress = (name: string, progress: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === name ? { ...file, progress } : file,
      ),
    )
  }

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true)
    const dataTransfer = new DataTransfer()
    const duplicateFiles: string[] = []

    acceptedFiles.forEach((file) => {
      if (files.some((existingFile) => existingFile.name === file.name)) {
        duplicateFiles.push(file.name)
      } else {
        dataTransfer.items.add(file)
      }
    })

    if (duplicateFiles.length > 0) {
      setSnackbar({
        open: true,
        message: `File${
          duplicateFiles.length > 1 ? 's' : ''
        } already exists: ${duplicateFiles.join(', ')}`,
        severity: 'warning',
      })
      if (dataTransfer.files.length === 0) {
        setIsUploading(false)
        return
      }
    }

    // Initialize files with progress 0
    const newFiles = Array.from(dataTransfer.files).map((file) => ({
      name: file.name,
      progress: 0,
      url: URL.createObjectURL(file),
    }))

    setFiles((prevFiles) => [...prevFiles, ...newFiles])

    try {
      const uploadedFiles = await api.uploadFiles(
        dataTransfer.files,
        (progress) => {
          updateFileProgress(progress.name, progress.progress)
        },
      )

      // Update file URLs after successful upload and revoke blob URLs
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          const uploadedFile = uploadedFiles.find(
            (finalFile) => finalFile.name === file.name,
          )
          if (uploadedFile) {
            // Revoke the blob URL to prevent memory leaks
            if (file.url.startsWith('blob:')) {
              URL.revokeObjectURL(file.url)
            }
            return {
              ...file,
              progress: 100,
              url: uploadedFile.fileUrl,
            }
          }
          return file
        }),
      )
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to upload files',
        severity: 'error',
      })
      console.error('Failed to upload files:', error)

      // Remove failed uploads from the UI
      setFiles((prevFiles) =>
        prevFiles.filter(
          (file) =>
            !Array.from(dataTransfer.files).some(
              (newFile) => newFile.name === file.name,
            ),
        ),
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (fileToDelete: {
    name: string
    url: string
  }) => {
    try {
      // Revoke blob URL if it exists
      if (fileToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.url)
      } else {
        // Only add to deletedFiles if it's not a blob URL
        setDeletedFiles((prev) => [...prev, fileToDelete.url])
        // Only delete from storage if it's not a blob URL
        await api.deleteFiles([fileToDelete.url])
      }

      // Remove the file from the UI immediately
      setFiles((prevFiles) =>
        prevFiles.filter(
          (file) =>
            !(file.name === fileToDelete.name && file.url === fileToDelete.url),
        ),
      )
    } catch (error) {
      console.error('Failed to delete file:', error)
      setSnackbar({
        open: true,
        message: 'Failed to delete file',
        severity: 'error',
      })
    }
  }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          border: '1px dashed #ccc',
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <FileUploadArea
          hasError={hasError}
          onDrop={onDrop}
          hasFiles={files?.length > 0}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              p: 2,
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            {files?.length > 0 && (
              <Box
                key='add-more'
                sx={{
                  position: 'relative',
                  flex: '1 1 200px',
                  minWidth: '180px',
                  maxWidth: '250px',
                  height: '200px',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'grey.100',
                    '& .addIcon': {
                      color: 'primary.main',
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <AddPhotoAlternate
                  className='addIcon'
                  sx={{
                    fontSize: 40,
                    color: 'grey.400',
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              </Box>
            )}
            {files?.map((uploadedFile, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  flex: '1 1 200px',
                  minWidth: '180px',
                  maxWidth: '250px',
                  height: '200px',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{ width: '100%', height: '100%' }}
                  >
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: uploadedFile.progress === 100 ? 1 : 0.7,
                        transition: 'opacity 0.3s ease',
                      }}
                      src={uploadedFile.url || ''}
                      alt={`Memory Image ${index + 1}`}
                    />
                  </Box>
                </Box>
                {uploadedFile.progress < 100 && (
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CircularProgress
                        variant='determinate'
                        value={100}
                        size={60}
                        sx={{
                          color: 'rgba(0, 0, 0, 0.1)',
                          position: 'absolute',
                        }}
                      />
                      <CircularProgress
                        variant='determinate'
                        value={uploadedFile.progress}
                        size={60}
                        sx={{
                          color: 'primary.main',
                          position: 'absolute',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant='caption'
                          component='div'
                          sx={{ color: 'primary.main', fontWeight: 'bold' }}
                        >
                          {`${Math.round(uploadedFile.progress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                {uploadedFile.progress === 100 && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                      },
                    }}
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteImage(uploadedFile)
                    }}
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </FileUploadArea>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ImageUploader
