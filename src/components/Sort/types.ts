import { SelectChangeEvent } from '@mui/material'

export interface SortProps {
  sort: string
  order: string
  onSortChange: (event: SelectChangeEvent<string>) => void
  onOrderChange: (event: SelectChangeEvent<string>) => void
}
