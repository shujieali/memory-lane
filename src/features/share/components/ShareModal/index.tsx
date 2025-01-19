import { useState, useRef } from 'react'
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  TextField,
  IconButton as MuiIconButton,
} from '@mui/material'
import {
  Close,
  ContentCopy,
  ChevronLeft,
  ChevronRight,
  Share as ShareIcon,
} from '@mui/icons-material'
import { enqueueSnackbar } from 'notistack'

interface ShareModalProps {
  title: string
  description: string
  url: string
  open: boolean
  onClose: () => void
}

const shareLinks = (title: string, description: string, url: string) => [
  {
    name: 'WhatsApp',
    url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${url}`)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    backgroundColor: '#25D366',
  },
  {
    name: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    backgroundColor: '#1877f2',
  },
  {
    name: 'X',
    url: `https://x.com/intent/tweet?text=${encodeURIComponent(`${title}\n${description}\n${url}`)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
    backgroundColor: '#000000',
  },
  {
    name: 'LinkedIn',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    backgroundColor: '#0a66c2',
  },
  {
    name: 'Reddit',
    url: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    icon: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
    backgroundColor: '#ff4500',
  },
  {
    name: 'Pinterest',
    url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png',
    backgroundColor: '#e60023',
  },
  {
    name: 'Telegram',
    url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
    backgroundColor: '#0088cc',
  },
  {
    name: 'Email',
    url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    backgroundColor: '#EA4335',
  },
  {
    name: 'KakaoTalk',
    url: `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: 'https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png',
    backgroundColor: '#FFE812',
  },
  {
    name: 'Line',
    url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    backgroundColor: '#00b900',
  },
  {
    name: 'Tumblr',
    url: `https://www.tumblr.com/share/link?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Tumblr.svg',
    backgroundColor: '#36465d',
  },
]

export default function ShareModal({
  title,
  description,
  url,
  open = false,
  onClose = () => {},
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        onClose()
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  const handleSendEmail = () => {
    // TODO: Implement email sending logic here
    enqueueSnackbar('Email sent successfully', { variant: 'success' })
    setEmail('')
    onClose()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      enqueueSnackbar('Link copied to clipboard', { variant: 'success' })
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>Share</Typography>
          <MuiIconButton
            edge='end'
            color='inherit'
            onClick={onClose}
            aria-label='close'
          >
            <Close />
          </MuiIconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', my: 2 }}>
          {showLeftArrow && (
            <IconButton
              onClick={() => scroll('left')}
              sx={(theme) => ({
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 2,
                '&:hover': { backgroundColor: theme.palette.action.hover },
              })}
            >
              <ChevronLeft />
            </IconButton>
          )}
          {showRightArrow && (
            <IconButton
              onClick={() => scroll('right')}
              sx={(theme) => ({
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 2,
                '&:hover': { backgroundColor: theme.palette.action.hover },
              })}
            >
              <ChevronRight />
            </IconButton>
          )}
          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 2,
              px: 2,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              '& > *': { flex: '0 0 auto' },
            }}
          >
            {shareLinks(title, description, url).map((link) => (
              <Box
                key={link.name}
                display='flex'
                flexDirection='column'
                alignItems='center'
                sx={{ cursor: 'pointer', width: 80 }}
                onClick={() => window.open(link.url, '_blank')}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: link.backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <img
                    src={link.icon}
                    alt={link.name}
                    width={30}
                    height={30}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant='body2' align='center' noWrap>
                  {link.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          mt={3}
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
            p: 2,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          })}
        >
          {/* Link sharing row */}
          <Box display='flex' gap={1} alignItems={'center'}>
            <TextField
              fullWidth
              variant='outlined'
              value={url}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button
                    variant='contained'
                    onClick={handleCopyLink}
                    startIcon={<ContentCopy />}
                    sx={{ ml: 1, borderRadius: 10 }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                ),
              }}
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
              })}
            />
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <IconButton sx={{ borderRadius: 10 }} onClick={handleShare}>
                <ShareIcon
                  fontSize='large'
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                />
              </IconButton>
            )}
          </Box>

          {/* Email sending row */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type='email'
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant='outlined'
              fullWidth
              required
              sx={{ flex: 1 }}
            />
            <Button
              variant='contained'
              onClick={handleSendEmail}
              disabled={!email}
              sx={{ borderRadius: 5 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
