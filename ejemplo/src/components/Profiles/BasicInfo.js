import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';

function BasicInfo({ person }) {
  const photoUrl = person.photo ? `http://localhost:3001${person.photo}` : '/images/default-avatar.png';
  const addressProofUrl = person.address_proof ? `http://localhost:3001${person.address_proof}` : null;
  const idCardUrl = person.id_card ? `http://localhost:3001${person.id_card}` : null;

  const formatFolio = (folio) => {
    return folio ? String(folio).padStart(4, '0') : 'No asignado';
  };

  return (
    <Box mb={5} sx={{ boxShadow: 2, borderRadius: '6px', overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#f8f8f8', padding: '8px 16px' }}>
        <Typography variant="h6" fontWeight="bold">Información Básica</Typography>
      </Box>
      <Box sx={{ backgroundColor: '#FFF', p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Box
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #eee',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                src={photoUrl}
                alt={`${person.name} ${person.surname}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.src = '/images/default-avatar.png';
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {person.name} {person.surname}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: '#666', fontSize: '0.9rem' }}>
              Folio: {formatFolio(person.folio)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Nombre" variant="outlined" value={person.name || 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Apellido" variant="outlined" value={person.surname || 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Fecha de Nacimiento" variant="outlined" value={person.birth_date ? new Date(person.birth_date).toLocaleDateString() : 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Género" variant="outlined" value={person.gender || 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Estado Civil" variant="outlined" value={person.civil_status || 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Ocupación" variant="outlined" value={person.occupation || 'No disponible'} InputProps={{ readOnly: true }} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" mt={2} mb={2}>Documentos</Typography>

                {/* Comprobante de Domicilio */}
                {addressProofUrl ? (
                  <Box sx={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1">Comprobante de Domicilio:</Typography>
                    {/* Enlace para descargar */}
                    <a href={addressProofUrl} download target="_blank" rel="noopener noreferrer">
                      Descargar Comprobante de Domicilio
                    </a>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Comprobante de domicilio no disponible
                  </Typography>
                )}

                {/* Tarjeta de Identificación */}
                {idCardUrl ? (
                  <Box>
                    <Typography variant="subtitle1">Tarjeta de Identificación:</Typography>
                    {/* Enlace para descargar */}
                    <a href={idCardUrl} download target="_blank" rel="noopener noreferrer">
                      Descargar Identificación
                    </a>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                 <a href={idCardUrl} download target="_blank" rel="noopener noreferrer">
                      Descargar Identificación
                    </a>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default BasicInfo;
