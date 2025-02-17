import { TextField, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import React, { useMemo } from 'react'
import { debounce } from 'lodash'
import { SearchAndFilterProps } from './types'

export default function SearchAndFilter({
  search,
  onSearchChange,
}: SearchAndFilterProps) {
  const debouncedSearchChange = useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event)
      }, 300),
    [onSearchChange],
  )

  return (
    <TextField
      label='Search Memories'
      defaultValue={search}
      onChange={debouncedSearchChange}
      variant='outlined'
      fullWidth
      sx={{ mr: 2, height: '56px' }} // Set height to match the button
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}
