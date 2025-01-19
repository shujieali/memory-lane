import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
  Skeleton,
  Chip,
  Stack,
} from '@mui/material'
import {
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  ArrowBack,
  ArrowForward,
  CalendarToday,
} from '@mui/icons-material'
import { useState } from 'react'
import { api } from '../../../../services/api'
import { ShareButton } from '../../../share'
import { useSettings } from '../../../../hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRoutePathWithParams } from '../../../../Routes/utils'

import { MemoryCardProps } from './types'

export default function MemoryCard({
  id,
  title,
  description,
  image_urls,
  timestamp,
  is_favorite,
  tags = [],
  public_id,
  onEdit,
  onDelete,
  isPublic = false,
  disabled = false,
}: MemoryCardProps) {
  const [isFavorite, setIsFavorite] = useState(is_favorite)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const { settings } = useSettings()
  const { compactView } = settings.theme
  const { showDates, showTags } = settings.display
  const publicUrl = `${import.meta.env.VITE_API_BASE_URL}/social/memory/${public_id}`

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % image_urls.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + image_urls.length) % image_urls.length,
    )
  }

  const handleClick = () => {
    if (disabled) return
    const memoryRoute = isPublic ? 'publicMemory' : 'memoryDetail'
    const routeParams = isPublic ? { public_id } : { id }
    navigate(getRoutePathWithParams(memoryRoute, routeParams), {
      state: { from: location.pathname },
    })
  }
  const renderTags = () => {
    if (!showTags || !tags?.length) return null
    return (
      <Stack
        direction='row'
        spacing={1}
        sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}
      >
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size='small'
              icon={<LocalOffer />}
              variant='outlined'
            />
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            No tags available
          </Typography>
        )}
      </Stack>
    )
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(compactView && {
          '& .MuiCardContent-root': {
            py: 1,
            px: 1.5,
          },
          '& .MuiCardActions-root': {
            py: 0.5,
            px: 1,
          },
          '& .MuiCardMedia-root': {
            height: 150,
          },
          '& .MuiTypography-h6': {
            fontSize: '1rem',
            marginBottom: 0.5,
          },
          '& .MuiTypography-body2': {
            fontSize: '0.875rem',
            WebkitLineClamp: 2,
          },
          '& .MuiChip-root': {
            height: 24,
            '& .MuiChip-label': {
              fontSize: '0.75rem',
              padding: '0 6px',
            },
            '& .MuiChip-icon': {
              fontSize: '0.875rem',
              width: 16,
              height: 16,
              marginLeft: '4px',
            },
          },
        }),
      }}
    >
      {imageLoading && (
        <Skeleton
          data-testid='skeleton'
          variant='rectangular'
          height={compactView ? 150 : 200}
          animation='wave'
          sx={{ bgcolor: 'grey.200' }}
        />
      )}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component='img'
          height={compactView ? 150 : 200}
          image={image_urls[currentImageIndex]}
          alt={title}
          sx={{
            objectFit: 'cover',
            display: imageLoading ? 'none' : 'block',
            ...(!disabled && { cursor: 'pointer' }),
          }}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          onClick={() => handleClick()}
        />
        {image_urls.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                color: 'white',
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                color: 'white',
              }}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant='h6' component='div'>
          {title}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>
        {showDates && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday
              sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
            />
            <Typography variant='body2' color='text.secondary'>
              {new Date(timestamp).toLocaleDateString('default', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        )}
        {renderTags()}
      </CardContent>
      <CardActions disableSpacing>
        <Box
          sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}
        >
          {onEdit && onDelete && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={() => onEdit(id)}
                size='small'
                color='primary'
                aria-label='edit memory'
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => onDelete(id)}
                size='small'
                color='error'
                aria-label='delete memory'
              >
                <Delete />
              </IconButton>
            </Box>
          )}
          <ShareButton
            title={title}
            description={description}
            url={publicUrl}
          />
          {!isPublic && (
            <IconButton
              onClick={async () => {
                try {
                  const newFavoriteStatus = await api.toggleFavorite(id)
                  setIsFavorite(newFavoriteStatus)
                } catch (error) {
                  console.error('Failed to toggle favorite:', error)
                }
              }}
              size='small'
              color='error'
              aria-label={
                isFavorite ? 'remove from favorites' : 'add to favorites'
              }
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          )}
        </Box>
      </CardActions>
    </Card>
  )
}
