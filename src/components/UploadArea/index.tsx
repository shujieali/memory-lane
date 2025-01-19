import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { baseStyle, activeStyle, acceptStyle, rejectStyle } from './constants'
import { UploadPopOver } from './UploadPopOver'
import { FileSelect } from './FileSelect'
import { FileUploadAreaProps } from './types'

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  hasFiles = false,
  onDrop = (): void => {},
  children,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    onDrop,
    multiple: true,
  })
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  )

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          ...style,
        }}
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        <input {...getInputProps()} />
        {children}
        <Box
          style={{
            display: hasFiles ? 'none' : 'flex',
            width: '100%',
            position: 'absolute',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px',
              width: '100%',
            }}
          >
            <FileSelect open={open} />
            <UploadPopOver isDragAccept={isDragAccept} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FileUploadArea
