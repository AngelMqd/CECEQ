// src/components/Profiles/ContactInfo.js
import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';

function ContactInfo({ person, getStatusBadge }) {
  return (
    <Box mb={5} sx={{ boxShadow: 2, borderRadius: '6px', overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#f8f8f8', padding: '8px 16px' }}>
        <Typography variant="h6" fontWeight="bold">Información de Contacto</Typography>
      </Box>
      <Box sx={{ backgroundColor: '#FFF', p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Teléfono" variant="outlined" value={person.phone} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Estado"
              variant="outlined"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusBadge(person.status)}
                  </Box>
                ),
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ContactInfo;
