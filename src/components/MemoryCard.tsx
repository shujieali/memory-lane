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
} from '@mui/icons-material'
import { useState } from 'react'
import { api } from '../services/api'
import { Memory } from '../types/memory'
import { useSettings } from '../context/SettingsContext'

interface MemoryCardProps extends Omit<Memory, 'user_id'> {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MemoryCard({
  id,
  title,
  description,
  image_url,
  timestamp,
  is_favorite,
  tags = [],
  onEdit,
  onDelete,
}: MemoryCardProps) {
  const [isFavorite, setIsFavorite] = useState(is_favorite)
  const [imageLoading, setImageLoading] = useState(true)

  const { settings } = useSettings()
  const { compactView } = settings.theme
  const { showDates, showTags } = settings.display

  const renderTags = () => {
    if (!showTags || !tags?.length) return null
    return (
      <Stack
        direction='row'
        spacing={1}
        sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}
      >
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size='small'
            icon={<LocalOffer />}
            variant='outlined'
          />
        ))}
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
      <CardMedia
        component='img'
        height={compactView ? 150 : 200}
        image={image_url}
        alt={title}
        sx={{
          objectFit: 'cover',
          display: imageLoading ? 'none' : 'block',
        }}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      />
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
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ mt: 1, display: 'block' }}
          >
            {new Date(timestamp).toLocaleDateString()}
          </Typography>
        )}
        {renderTags()}
      </CardContent>
      <CardActions disableSpacing>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box>
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
        </Box>
      </CardActions>
    </Card>
  )
}
