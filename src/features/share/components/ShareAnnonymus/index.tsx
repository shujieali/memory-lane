import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { Send } from '@mui/icons-material'
import { api } from '../../../../services/api'

interface AnonymsShareProps {
  title: string
  description: string
  url: string
  emailDialogOpen: boolean
  setEmailDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AnonymsShare({
  title,
  description,
  url,
  emailDialogOpen,
  setEmailDialogOpen,
}: AnonymsShareProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendEmail = async () => {
    if (!email) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setEmailError('')

    try {
      await api.sendAnonymousEmail(email, title, description, url)
      setEmailDialogOpen(false)
      setEmail('')
      enqueueSnackbar('Memory shared successfully', { variant: 'success' })
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailError('Failed to send email. Please try again.')

      enqueueSnackbar(
        'An error occurred while sharing the memory. Please try again later.',
        { variant: 'error' },
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Share Memory via Email</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Anonymously Share this memory with someone via email. Your identity
            will remain anonymous.
          </Typography>
          <TextField
            autoFocus
            margin='dense'
            label='Recipient Email'
            type='email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Box sx={{ position: 'relative' }}>
            <Button
              onClick={handleSendEmail}
              variant='contained'
              disabled={loading}
              endIcon={!loading && <Send />}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}
