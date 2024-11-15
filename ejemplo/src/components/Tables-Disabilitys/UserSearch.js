import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UserSearch = ({ searchTerm, handleSearch }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', width: '40%', padding: '3px', mt: 2 }}> {/* Agregado mt: 5 para margen superior */}
      <TextField
        variant="outlined"
        placeholder="Buscar por nombre e Id..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#6c757d' }} /> {/* Icono de búsqueda */}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              
            </InputAdornment>
          ),
        }}
        sx={{
          width: '100%',
          height: '32px', // Hacer el campo más fino
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px', // Bordes redondeados
            fontSize: '14px',
            backgroundColor: '#ffffff', // Fondo blanco
            paddingRight: '0px', // Ajustar padding para hacerlo más fino
          },
          '& .MuiInputAdornment-root': {
            marginRight: '8px', // Espaciado entre el input y el ícono/adornment
          },
          '& input': {
            padding: '5.8px', // Ajustar padding interno del input
          },
        }}
      />
    </Box>
  );
};

export default UserSearch;
