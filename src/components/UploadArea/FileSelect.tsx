import { Typography } from '@mui/material'
import {
  FileSelectContainer,
  RowContainer,
  CustomizedButton,
} from './components'
import { FileSelectProps } from './types'

export const FileSelect = ({ open }: FileSelectProps) => {
  return (
    <FileSelectContainer>
      <RowContainer>
        <Typography
          sx={{
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 400,
          }}
        >
          Drop files to upload
        </Typography>
      </RowContainer>
      <RowContainer>
        <Typography
          sx={{
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 400,
          }}
        >
          or
        </Typography>
      </RowContainer>
      <RowContainer
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          open()
        }}
      >
        <CustomizedButton variant='outlined'>Select files</CustomizedButton>
      </RowContainer>
    </FileSelectContainer>
  )
}

export default FileSelect
