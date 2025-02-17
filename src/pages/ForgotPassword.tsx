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
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await api.requestPasswordReset(email)
      setSuccess(true)
    } catch {
      setError('Failed to send password reset email. Please try again.')
    } finally {
      setLoading(false)
    }
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
            Reset Password
          </Typography>
          {success ? (
            <>
              <Alert severity='success' sx={{ mb: 2 }}>
                If an account exists with this email, you will receive password
                reset instructions.
              </Alert>
              <Box sx={{ textAlign: 'center' }}>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </Box>
            </>
          ) : (
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Enter your email address and we will send you instructions to
                reset your password.
              </Typography>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Send Reset Instructions
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
