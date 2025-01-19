export interface FileUploadAreaProps {
  hasFiles: boolean
  onDrop?: (acceptedFiles: File[]) => void
  children?: React.ReactNode
}

export interface uploadPopOverProps {
  isDragAccept: boolean
}

export interface FileSelectProps {
  open: () => void
}
