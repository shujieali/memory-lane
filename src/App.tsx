import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './context/authContext'
import { SettingsProvider } from './context/settingsContext'
import { ShareProvider } from './context/shareContext'
import { useSettings, useOfflineDetection } from './hooks'
import { createAppTheme } from './theme/theme'
import Routes from './Routes/AppRoutes'

const AppWithSettings = () => {
  const { settings } = useSettings()
  const theme = createAppTheme(settings.theme.mode || 'light')
  // Initialize offline detection
  useOfflineDetection()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <ShareProvider>
          <Routes />
        </ShareProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

const MemoryLane = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppWithSettings />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default MemoryLane

// import React from 'react'
// import { Box, Typography, Stack, IconButton } from '@mui/material'
// import SettingsIcon from '@mui/icons-material/Settings'
// import AppsIcon from '@mui/icons-material/Apps'

// const Timeline = () => {
//   const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2012]

//   return (
//     <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           p: 1,
//         }}
//       >
//         <IconButton>
//           <SettingsIcon />
//         </IconButton>
//         <IconButton>
//           <AppsIcon />
//         </IconButton>
//         <Box
//           sx={{
//             width: 40,
//             height: 40,
//             borderRadius: '50%',
//             bgcolor: 'grey.300',
//           }}
//         />
//       </Box>

//       {/* Current Month/Year */}
//       <Typography
//         variant='h6'
//         sx={{
//           p: 2,
//           borderBottom: '2px solid #1976d2',
//         }}
//       >
//         Dec 2024
//       </Typography>

//       {/* Timeline */}
//       <Stack spacing={2} sx={{ p: 2 }}>
//         {years.map((year) => (
//           <Box
//             key={year}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               position: 'relative',
//             }}
//           >
//             {/* Vertical line */}
//             <Box
//               sx={{
//                 position: 'absolute',
//                 left: '50%',
//                 height: '100%',
//                 width: 1,
//                 bgcolor: 'grey.300',
//                 zIndex: 0,
//               }}
//             />

//             {/* Year marker */}
//             <Typography
//               sx={{
//                 position: 'relative',
//                 zIndex: 1,
//                 bgcolor: 'background.paper',
//               }}
//             >
//               {year}
//             </Typography>

//             {/* Content area for photos */}
//             <Box sx={{ flexGrow: 1, minHeight: 50 }}>
//               {/* Add your photo components here */}
//             </Box>
//           </Box>
//         ))}
//       </Stack>
//     </Box>
//   )
// }

// export default Timeline
