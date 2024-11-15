// src/components/Profiles/StudiesInfo.js
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

function StudiesInfo({ person }) {
  return (
    <Box mb={5} sx={{ boxShadow: 2, borderRadius: '6px', overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#f8f8f8', padding: '8px 16px' }}>
        <Typography variant="h6" fontWeight="bold">Últimos Estudios</Typography>
      </Box>
      <Box sx={{ backgroundColor: '#FFF', p: 3 }}>
        <TextField
          label="Últimos Estudios"
          variant="outlined"
          value={person.last_studies}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Box>
    </Box>
  );
}

export default StudiesInfo;
