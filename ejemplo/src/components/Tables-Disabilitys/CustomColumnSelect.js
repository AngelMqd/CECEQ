import React from 'react';
import { FormControl, MenuItem, Select, ListItemText, Box } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

// Componente personalizado de icono de círculo
const CircleIcon = ({ active }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      backgroundColor: active ? '#44b700' : 'lightgray',
      borderRadius: '50%',
      marginRight: 2,
    }}
  />
);

const CustomColumnSelect = ({ selectedColumns, handleColumnChange }) => {
  return (
    <FormControl sx={{ minWidth: 100 }}>
      <Select
        multiple
        value={selectedColumns.filter(col => col.checked).map(col => col.id)}
        renderValue={() => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterAltIcon fontSize="small" sx={{ color: '#9e9e9e', mr: 1 }} /> {/* Icono de filtro */}
            Filtros
          </Box>
        )}
        displayEmpty
        sx={{
          width: '200px', // Más ancho
          height: '32px', // Más fino, menos alto
          border: 'none',
          padding: '4px', // Ajuste del padding para reducir la altura interna
          fontSize: '14px',
          backgroundColor: '#ffffff', // Color de fondo blanco
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9e9e9e',
          },
        }}
        // Ajuste del IconComponent para que el clic abra el menú
        IconComponent={UnfoldMoreIcon} // Esto asegura que el ícono sea parte del menú
        MenuProps={{
          PaperProps: {
            sx: {
              minWidth: 250, // Ancho del menú
              maxHeight: 300,
              overflowY: 'auto',
            },
          },
        }}
      >
        {selectedColumns.map((column) => (
          <MenuItem key={column.id} onClick={() => handleColumnChange(column)}>
            <CircleIcon active={column.checked} />
            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomColumnSelect;
