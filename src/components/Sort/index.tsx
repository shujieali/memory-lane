import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Menu,
} from '@mui/material'
import { Sort as SortIcon } from '@mui/icons-material'
import React, { useState } from 'react'
import { SortProps } from './types'

export default function Sort({
  sort,
  order,
  onSortChange,
  onOrderChange,
}: SortProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant='text'
        startIcon={<SortIcon />}
        onClick={handleSortClick}
        sx={{ height: '20px' }} // Set height to match the TextField
      >
        Sort
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} onChange={onSortChange} label='Sort By'>
              <MenuItem value='timestamp'>Date</MenuItem>
              <MenuItem value='title'>Title</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant='outlined' fullWidth>
            <InputLabel>Order</InputLabel>
            <Select value={order} onChange={onOrderChange} label='Order'>
              <MenuItem value='asc'>Ascending</MenuItem>
              <MenuItem value='desc'>Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>
    </>
  )
}
