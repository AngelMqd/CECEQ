import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Array con las columnas para seleccionar (similares a tu código anterior)
const options = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nombre' },
  { id: 'surname', label: 'Apellido' },
  { id: 'gender', label: 'Género' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'civil_status', label: 'Estado Civil' },
  { id: 'address', label: 'Dirección' },
  { id: 'estate', label: 'Estado' },
];

const CustomFilterSelect = ({ selectedOptions, setSelectedOptions }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Maneja la apertura del menú
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Maneja el cierre del menú
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Cambia las opciones seleccionadas
  const handleToggle = (option) => {
    const currentIndex = selectedOptions.indexOf(option.id);
    const newChecked = [...selectedOptions];

    if (currentIndex === -1) {
      newChecked.push(option.id); // Agrega si no está seleccionado
    } else {
      newChecked.splice(currentIndex, 1); // Elimina si está seleccionado
    }

    setSelectedOptions(newChecked);
  };

  return (
    <Box>
     
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{
          width: 200,
          justifyContent: 'space-between',
          textAlign: 'left',
          border: '1px solid #ccc',
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#f0f4f8',
          },
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        Filtros
      </Button>

      {/* Menú con las opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            maxHeight: 300,
            width: '200px',
            padding: '10px',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.id} onClick={() => handleToggle(option)}>
            {/* Checkbox que cambia el estado */}
            <Checkbox
              checked={selectedOptions.includes(option.id)}
              sx={{
                color: selectedOptions.includes(option.id) ? 'green' : 'lightgray',
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}
            />
            {/* Texto con el nombre de la opción */}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CustomFilterSelect;
