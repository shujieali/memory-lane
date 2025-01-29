import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Modal,
  IconButton,
  Grid2 as Grid,
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

export default function MemoryCardPreview({ memory }: { memory: Memory }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
          mb: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          {/* Title and Favorite */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant='h5'
              component='h2'
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
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
          <Typography
            variant='body1'
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
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

        {/* Photos Grid */}
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {memory.image_urls.map((url, index) => (
            <Grid key={index}>
              <Box
                sx={{
                  cursor: 'pointer',
                  width: '200px',
                  height: '200px',
                  paddingTop: '100%', // Creates a square aspect ratio
                  position: 'relative',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'hidden',
                  '&:hover': {
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  },
                }}
                onClick={() => handleImageClick(url)}
              >
                <Box
                  component='img'
                  src={url}
                  alt={`Memory ${index + 1}`}
                  loading='lazy'
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
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
