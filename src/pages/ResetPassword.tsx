import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!token) {
      setError('Invalid reset token')
      setLoading(false)
      return
    }

    if (!validatePassword()) {
      setLoading(false)
      return
    }

    try {
      await api.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch {
      setError('Failed to reset password. The link may be expired or invalid.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Container maxWidth='xs'>
        <Box sx={{ mt: 8 }}>
          <Alert severity='error'>
            Invalid reset link. Please request a new password reset.
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ mt: 8, p: 4, width: '100%' }}>
          <Typography component='h1' variant='h5' gutterBottom>
            Reset Your Password
          </Typography>
          {success ? (
            <Alert severity='success'>
              Password successfully reset! Redirecting to login...
            </Alert>
          ) : (
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='New Password'
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirm New Password'
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Reset Password
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
