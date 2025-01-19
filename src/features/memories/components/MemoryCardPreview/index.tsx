import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  Paper,
  Chip,
  Stack,
  Modal,
  IconButton,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalOffer from '@mui/icons-material/LocalOffer'
import CloseIcon from '@mui/icons-material/Close'
import type { Memory } from '../../../../types/memory'
import { useState } from 'react'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1,
  borderRadius: 2,
}

const calculateImageListHeight = (imageCount: number) => {
  if (imageCount <= 3) return 180 // Slightly shorter for 1-3 images
  // Calculate number of rows needed (3 images per row)
  const rows = Math.ceil(imageCount / 3)
  // Each row is 160px high (shorter than before), with 8px gap between rows
  // Add 16px padding at the bottom for better spacing
  return rows * 160 + (rows - 1) * 8 + 16
}

export default function MemoryCardPreview({ memory }: { memory: Memory }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const imageListHeight = calculateImageListHeight(memory.image_urls.length)

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mx: 2,
          mb: 2, // Add bottom margin to cards
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          {/* Title and Favorite */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant='h5' component='h2' sx={{ flex: 1 }}>
              {memory.title}
            </Typography>
            {memory.is_favorite ? (
              <FavoriteIcon color='error' sx={{ ml: 1 }} />
            ) : null}
          </Box>

          {/* Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon
              sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
            />
            <Typography variant='body2' color='text.secondary'>
              {new Date(memory.timestamp).toLocaleDateString('default', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant='body1' sx={{ mb: 2 }}>
            {memory.description}
          </Typography>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <Stack
              direction='row'
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {memory.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size='small'
                  icon={<LocalOffer />}
                  variant='outlined'
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Photos Grid with Bottom Padding */}
        <Box sx={{ pb: memory.image_urls.length > 6 ? 2 : 0 }}>
          <ImageList
            sx={{
              width: '100%',
              height: imageListHeight,
              m: 0,
              // Add overflow handling
              overflowY: 'hidden',
            }}
            cols={memory.image_urls.length <= 3 ? memory.image_urls.length : 3}
            gap={8}
          >
            {memory.image_urls.map((url, index) => (
              <ImageListItem
                key={index}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  },
                }}
                onClick={() => handleImageClick(url)}
              >
                <img
                  src={url}
                  alt={`Memory ${index + 1}`}
                  loading='lazy'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Paper>

      {/* Full Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        aria-labelledby='image-modal'
      >
        <Box sx={modalStyle}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt='Full size'
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 32px)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  )
}
