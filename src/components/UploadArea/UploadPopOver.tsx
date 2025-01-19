import { Typography, Box } from '@mui/material'
import BackupOutlined from '@mui/icons-material/BackupOutlined'
import { UploadPopOverContainer } from './components'
import { uploadPopOverProps } from './types'

export const UploadPopOver = ({ isDragAccept }: uploadPopOverProps) => {
  return (
    <UploadPopOverContainer style={{ display: isDragAccept ? 'flex' : 'none' }}>
      <Box
        sx={{
          width: '200px',
        }}
      >
        <BackupOutlined sx={{ fontSize: 80, color: 'white' }} />
        <Typography
          sx={{
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 400,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Incoming!
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '17.5px',
            fontWeight: 400,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Drop your files to upload them
        </Typography>
      </Box>
    </UploadPopOverContainer>
  )
}

export default UploadPopOver
