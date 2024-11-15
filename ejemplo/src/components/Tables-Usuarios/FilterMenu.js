// src/components/Tables/FilterMenu.js
import React from 'react';
import { Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';

function FilterMenu({ anchorEl, handleMenuClose, selectedColumns, handleColumnChange }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {selectedColumns.map((column) => (
        <MenuItem key={column.id}>
          <Checkbox
            checked={column.checked}
            onChange={(event) => handleColumnChange(event, column)}
          />
          <ListItemText primary={column.label} />
        </MenuItem>
      ))}
    </Menu>
  );
}

export default FilterMenu;
