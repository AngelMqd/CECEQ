// src/components/Profiles/AddressInfo.js
import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';

function AddressInfo({ person }) {
  return (
    <Box mb={5} sx={{ boxShadow: 2, borderRadius: '6px', overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#f8f8f8', padding: '8px 16px' }}>
        <Typography variant="h6" fontWeight="bold">Dirección</Typography>
      </Box>
      <Box sx={{ backgroundColor: '#FFF', p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Dirección" variant="outlined" value={person.address} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Estado/Provincia" variant="outlined" value={person.estate} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Extranjero" variant="outlined" value={person.foreign ? 'Sí' : 'No'} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AddressInfo;
