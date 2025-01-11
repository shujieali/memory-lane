import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

interface DeleteConfirmDialogProps {
  open: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Delete Memory</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete &quot;{title}&quot;? This action
          cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
