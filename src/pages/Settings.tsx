import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  Typography,
  Stack,
} from '@mui/material'
import { useSettings } from '../hooks'
import {
  Brightness4,
  Brightness7,
  ViewCompact,
  ViewComfy,
} from '@mui/icons-material'

export default function Settings() {
  const { settings, updateSettings } = useSettings()

  return (
    <Container maxWidth='md'>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Theme & Display
          </Typography>

          <Stack spacing={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'background.default',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {settings.theme.mode === 'dark' ? (
                  <Brightness4 color='primary' />
                ) : (
                  <Brightness7 color='primary' />
                )}
                <Typography>Dark Mode</Typography>
              </Box>
              <Switch
                checked={settings.theme.mode === 'dark'}
                onChange={(e) =>
                  updateSettings({
                    theme: { mode: e.target.checked ? 'dark' : 'light' },
                  })
                }
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'background.default',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {settings.theme.compactView ? (
                  <ViewCompact color='primary' />
                ) : (
                  <ViewComfy color='primary' />
                )}
                <Typography>Compact View</Typography>
              </Box>
              <Switch
                checked={settings.theme.compactView}
                onChange={(e) =>
                  updateSettings({
                    theme: { compactView: e.target.checked },
                  })
                }
              />
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Display
          </Typography>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Cards per Row</FormLabel>
            <RadioGroup
              value={settings.display.cardsPerRow}
              onChange={(e) =>
                updateSettings({
                  display: {
                    cardsPerRow: Number(e.target.value) as 2 | 3 | 4,
                  },
                })
              }
            >
              <FormControlLabel value={2} control={<Radio />} label='Two' />
              <FormControlLabel value={3} control={<Radio />} label='Three' />
              <FormControlLabel value={4} control={<Radio />} label='Four' />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.showDates}
                    onChange={(e) =>
                      updateSettings({
                        display: { showDates: e.target.checked },
                      })
                    }
                  />
                }
                label='Show Dates'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.showTags}
                    onChange={(e) =>
                      updateSettings({
                        display: { showTags: e.target.checked },
                      })
                    }
                  />
                }
                label='Show Tags'
              />
            </FormGroup>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Notifications
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.enabled}
                  onChange={(e) =>
                    updateSettings({
                      notifications: { enabled: e.target.checked },
                    })
                  }
                />
              }
              label='Enable Notifications'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.emailNotifications}
                  disabled={!settings.notifications.enabled}
                  onChange={(e) =>
                    updateSettings({
                      notifications: {
                        emailNotifications: e.target.checked,
                      },
                    })
                  }
                />
              }
              label='Email Notifications'
            />
          </FormGroup>
        </Paper>
      </Box>
    </Container>
  )
}
