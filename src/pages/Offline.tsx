import { Container, Stack, Typography } from '@mui/material'
import { WifiOff } from '@mui/icons-material'

const Offline = () => {
  return (
    <Container maxWidth='sm'>
      <Stack
        spacing={3}
        alignItems='center'
        justifyContent='center'
        sx={{ minHeight: '100vh', py: 4, textAlign: 'center' }}
      >
        <WifiOff sx={{ fontSize: 64, color: 'primary.main' }} />
        <Typography variant='h4' component='h1' color='primary'>
          You&apos;re Offline
        </Typography>
        <Typography variant='body1'>
          It seems you&apos;ve lost your internet connection. Memory Lane
          requires an internet connection to show your memories.
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Please check your connection and try again.
        </Typography>
      </Stack>
    </Container>
  )
}

export default Offline
