export interface FileData {
  name: string
  progress: number
  url: string
}

export interface ImageUploaderProps {
  files: FileData[]
  setFiles: React.Dispatch<
    React.SetStateAction<
      {
        name: string
        progress: number
        url: string
      }[]
    >
  >
  onUploadStatusChange?: (isUploading: boolean) => void
}
