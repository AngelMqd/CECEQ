import React from 'react';
import { Box, TextField, Button } from '@mui/material';

function EditProfile() {
  return (
    <Box sx={{ p: 4, backgroundColor: '#FFF', borderRadius: '6px', boxShadow: 3, maxWidth: '800px', margin: '0 auto' }}>
      <h2>Editar Perfil</h2>
      <form>
        <TextField label="Nombre" fullWidth sx={{ mb: 2 }} />
        <TextField label="Apellido" fullWidth sx={{ mb: 2 }} />
        <TextField label="Teléfono" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary">Guardar Cambios</Button>
      </form>
    </Box>
  );
}

export default EditProfile;
