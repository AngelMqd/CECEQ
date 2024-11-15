import React from 'react';
import { Box, TextField, Checkbox, FormControlLabel } from '@mui/material';

function FormInputs({ formData, handleChange, setFormData }) {
  return (
    <Box>
      <TextField label="Folio" name="folio" value={formData.folio} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField label="Nombre" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="Apellido" name="surname" value={formData.surname} onChange={handleChange} fullWidth required />
      </Box>

      <TextField
        type="date"
        label="Fecha de Nacimiento"
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mt: 2 }}
      />

      <TextField label="Estado Civil" name="civil_status" value={formData.civil_status} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
      <TextField label="Dirección" name="address" value={formData.address} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
      <TextField label="Estado/Provincia" name="estate" value={formData.estate} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />

      <FormControlLabel
        control={<Checkbox checked={formData.foreign} onChange={() => setFormData({ ...formData, foreign: !formData.foreign })} />}
        label="Foráneo"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
        <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth required />
        <TextField label="Ocupación" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth required />
      </Box>

      <TextField label="Últimos Estudios" name="last_studies" value={formData.last_studies} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
    </Box>
  );
}

export default FormInputs;
